@quantum-script --execution-time --cmd "%0"
@exit %errorlevel%

Script.requireExtension("Shell");
Script.requireExtension("ShellFind");
Script.requireExtension("Console");
Script.requireExtension("JSON");
Script.requireExtension("SHA512");
Script.requireExtension("DateTime");
Script.requireExtension("Thread");

Console.writeLn("-> make-web web-dev");

if(Shell.directoryExists("output/library")){
	return;
};

// Extract
Shell.mkdir("output");
Shell.chdir("output");
Shell.mkdir("library");
Shell.chdir("library");
//
Shell.mkdir("electron");
Shell.chdir("electron");
Shell.system("7z x -aoa ../../../vendor/electron-v13.1.5-win32-x64.zip");
Shell.chdir("..");
//
Shell.system("7zr x ../../vendor/electron-v13.1.5-modules.7z");
Shell.rename("electron-v13.1.5-modules","electron-modules");
//
Shell.mkdir("../../temp");
Shell.chdir("../../temp");
Shell.system("7zr x ../vendor/httpd-2.4.48-win64-msvc-2019.7z");
Shell.system("7z x -aoa ../vendor/httpd-2.4.48-win64-VS16.zip");
Shell.rename("Apache24","../output/library/apache-http-server");
Shell.copy("httpd-2.4.48-win64-msvc-2019/bin/rotatelogsw.exe","../output/library/apache-http-server/bin/rotatelogsw.exe");
Shell.chdir("../output/library");
Shell.chdir("apache-http-server");
Shell.removeDirRecursively("include");
Shell.removeDirRecursively("lib");
Shell.chdir("..");

//
Shell.system("7z x -aoa ../../vendor/mariadb-10.5.11-winx64.zip");
Shell.rename("mariadb-10.5.11-winx64","maria-db");
Shell.chdir("maria-db");
Shell.removeDirRecursively("include");
Shell.removeFile("bin/*.pdb");
Shell.removeFile("bin/*.lib");
Shell.removeFile("lib/*.pdb");
Shell.removeFile("lib/*.lib");
Shell.chdir("..");
//
Shell.mkdir("php");
Shell.chdir("php");
Shell.system("7z x -aoa ../../../vendor/php-8.0.8-Win32-vs16-x64.zip");
Shell.copy("../../../vendor/composer.phar","composer.phar");
Shell.chdir("..");
//
Shell.system("7z x -aoa ../../vendor/phpMyAdmin-5.1.1-all-languages.zip");
Shell.rename("phpMyAdmin-5.1.1-all-languages","phpmyadmin");
//
Shell.copy("../../vendor/vc-2019-redist.x64.exe","vc-2019-redist.x64.exe");
//
Shell.copy("../../vendor/cacert.pem","cacert.pem");
Shell.chdir("..");
Shell.chdir("..");
Shell.copyDirRecursively("LICENSES","output/LICENSES");
Shell.copyDirRecursively("source/web-dev.app","output/library/web-dev");
Shell.copyDirRecursively("source/application","output/application");
Shell.copyDirRecursively("source/config","output/config");

// Init Database
Shell.chdir("output/library/maria-db/bin");
Shell.system("mysql_install_db --verbose-bootstrap --datadir=../../../database");
Shell.chdir("../../../../");
Shell.remove("output/database/my.ini");

//
var config=JSON.decode(Shell.fileGetContents("output/config/config.json"));
var dateTime=new DateTime();
// Make a unique password, change GUID from time to time
Console.writeLn("New Maria DB password");
config["maria-db.password"]=SHA512.hash("{747F733D-2CBA-4464-BE13-A9FE52DE375A}"+dateTime.toUnixTime());
Console.writeLn("New phpMyAdmin secret");
config["phpmyadmin.secret"]=SHA512.hash("{929C1928-7E7A-4CDD-97B6-3F00F9495E3B}"+dateTime.toUnixTime());
Shell.filePutContents("output/config/config.json",JSON.encodeWithIndentation(config));
//
Shell.mkdirRecursivelyIfNotExists("output/repository");
var cwdX=(Shell.getcwd()+"/output").replace("\\","/");

// ---

var content=Shell.fileGetContents("output/config/maria-db.template.ini");
content=content.replace("$APPLICATION_PATH",cwdX);
content=content.replace("$CONFIG_PATH",cwdX+"/repository");
content=content.replace("$SERVER_PATH",cwdX+"/library/maria-db");
content=content.replace("$SERVER_PORT",config["maria-db.port"]);
Shell.filePutContents("output/repository/maria-db.ini",content);

var content=Shell.fileGetContents("output/config/maria-db.template.init.sql");
content=content.replace("$MARIA_DB_USERNAME",config["maria-db.username"]);
content=content.replace("$MARIA_DB_PASSWORD",config["maria-db.password"]);
content+="\r\n";
content+=Shell.fileGetContents("output/library/phpmyadmin/sql/create_tables.sql");
content+="\r\n";
content+="SHUTDOWN;";
Shell.filePutContents("output/repository/maria-db.init.sql",content);

// ---
Shell.mkdirRecursivelyIfNotExists("output/log");
Shell.mkdirRecursivelyIfNotExists("output/tmp");
//
Console.writeLn("Set Maria DB password and phpMyAdmin tables");
//
Shell.chdir("output/library/maria-db/bin");
Shell.execute("mysqld --defaults-file=\""+cwdX+"/repository/maria-db.ini"+"\" --skip-grant-tables --init-file=\""+cwdX+"/repository/maria-db.init.sql"+"\" --verbose");
Shell.chdir("../../../../");
Shell.removeDirRecursively("output/repository");
Shell.removeDirRecursively("output/log");
Shell.removeDirRecursively("output/tmp");
//
Console.writeLn("Done");

