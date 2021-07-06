//
// Web Dev
//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#include "xyo-win.hpp"

#include "web-dev-license.hpp"
#include "web-dev-copyright.hpp"
#include "web-dev-version.hpp"

namespace Main {

	using namespace XYO;

	class Application :
		public virtual IMain {
			XYO_DISALLOW_COPY_ASSIGN_MOVE(Application);
		protected:

			void showUsage();
			void showLicense();
		public:
			static char *msgBoxTitle;

			inline Application() {};

			int main(int cmdN, char *cmdS[]);
	};

	char *Application::msgBoxTitle = "Web Dev";

	void Application::showUsage() {
		char buffer[4096];
		String message;
		message << "Web Dev\n";
		sprintf(buffer, "version %s build %s [%s]\n", WebDev::Version::version(), WebDev::Version::build(), WebDev::Version::datetime());
		message << buffer;
		message << WebDev::Copyright::fullCopyright() << "\n\n";
		message <<
			"options:\n"
			"    --license           show license\n";
		message << "\n";
		MessageBox(nullptr, message, msgBoxTitle, MB_OK | MB_ICONINFORMATION);
	};

	void Application::showLicense() {
		MessageBox(nullptr, WebDev::License::content(), msgBoxTitle, MB_OK | MB_ICONINFORMATION);
	};

	int Application::main(int cmdN, char *cmdS[]) {
		int i;
		char *opt;
		char *fileIn;

		for (i = 1; i < cmdN; ++i) {
			if (strncmp(cmdS[i], "--", 2) == 0) {
				opt = &cmdS[i][2];
				if (strcmp(opt, "license") == 0) {
					showLicense();
					if (cmdN == 2) {
						return 0;
					};
				};
				continue;
			};
		};

		String exeFile=::XYO::Shell::getExecutable();
		String exePath=::XYO::Shell::getExecutablePath();
		String exeName=::XYO::Shell::getFileBasename(::XYO::Shell::getFileName(exeFile));
		String linkFile = exePath +
				::XYO::Shell::pathSeparator +
				"repository"+
				::XYO::Shell::pathSeparator +
				"Web Dev.lnk";

		if(!::XYO::Win::Ole::isValid()){
			MessageBox(nullptr, "#1 - Unable to initialize OLE", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		if(!::XYO::Shell::mkdirRecursivelyIfNotExists("log")){
			MessageBox(nullptr, "#2 - Unable to create log directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;			
		};

		if(!::XYO::Shell::mkdirRecursivelyIfNotExists("tmp")){
			MessageBox(nullptr, "#3 - Unable to create tmp directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;			
		};

		if(!::XYO::Shell::mkdirRecursivelyIfNotExists("repository")){
			MessageBox(nullptr, "#4 - Unable to create repository directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;			
		};

		if(!::XYO::Shell::mkdirRecursivelyIfNotExists("database")){
			MessageBox(nullptr, "#5 - Unable to create database directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;			
		};
		     
		if(!::XYO::Win::Shell::createLink(
				linkFile,
				exePath,
				exePath +
				::XYO::Shell::pathSeparator +
				"library" +
				::XYO::Shell::pathSeparator +
				"electron" +
				::XYO::Shell::pathSeparator +
				"electron.exe",
				String("library") +
				::XYO::Shell::pathSeparator +
				exeName +
				::XYO::Shell::pathSeparator +
				"application.js",
				exeFile,0,false)){
			MessageBox(nullptr, "#6 - Unable to create link", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};
		
		if(ShellExecute(NULL, "open", linkFile, NULL, NULL, SW_SHOWNORMAL)<(HINSTANCE)32){
			MessageBox(nullptr, "#7 - Unable to execute link", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		return 0;
	};

};

XYO_APPLICATION_WINMAIN_STD(Main::Application);

