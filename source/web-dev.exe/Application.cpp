// Web Dev
// Copyright (c) 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#include "Application.hpp"
#include "Copyright.hpp"
#include "License.hpp"
#include "Version.hpp"

namespace WebDev {

	char *Application::msgBoxTitle = "Web Dev";

	void Application::showUsage() {
		char buffer[4096];
		String message;
		message << "Web Dev\n";
		sprintf(buffer, "version %s build %s [%s]\n", WebDev::Version::version(), WebDev::Version::build(), WebDev::Version::datetime());
		message << buffer;
		message << WebDev::Copyright::copyright() << "\n\n";
		message << "options:\n"
		           "    --license           show license\n";
		message << "\n";
		MessageBox(nullptr, message, msgBoxTitle, MB_OK | MB_ICONINFORMATION);
	};

	void Application::showLicense() {
		MessageBox(nullptr, WebDev::License::license().c_str(), msgBoxTitle, MB_OK | MB_ICONINFORMATION);
	};

	void Application::showVersion() {
		char buffer[4096];
		String message;
		message << "Web Dev\n";
		sprintf(buffer, "version %s build %s [%s]\n", WebDev::Version::version(), WebDev::Version::build(), WebDev::Version::datetime());
		message << buffer;
		MessageBox(nullptr, message, msgBoxTitle, MB_OK | MB_ICONINFORMATION);
	};

	void Application::initMemory() {
		String::initMemory();
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

		String exeFile = ::XYO::System::Shell::getExecutable();
		String exePath = ::XYO::System::Shell::getExecutablePath();
		String exeName = ::XYO::System::Shell::getFileBasename(::XYO::System::Shell::getFileName(exeFile));
		String linkFile = exePath +
		                  ::XYO::System::Shell::pathSeparator +
		                  "repository" +
		                  ::XYO::System::Shell::pathSeparator +
		                  "Web Dev.lnk";

		if (!::XYO::Win::Ole::isValid()) {
			MessageBox(nullptr, "#1 - Unable to initialize OLE", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		if (!::XYO::System::Shell::mkdirRecursivelyIfNotExists("log")) {
			MessageBox(nullptr, "#2 - Unable to create log directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		if (!::XYO::System::Shell::mkdirRecursivelyIfNotExists("tmp")) {
			MessageBox(nullptr, "#3 - Unable to create tmp directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		if (!::XYO::System::Shell::mkdirRecursivelyIfNotExists("repository")) {
			MessageBox(nullptr, "#4 - Unable to create repository directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		if (!::XYO::System::Shell::mkdirRecursivelyIfNotExists("database")) {
			MessageBox(nullptr, "#5 - Unable to create database directory", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		if (!::XYO::Win::Shell::createLink(
		        linkFile,
		        exePath,
		        exePath +
		            ::XYO::System::Shell::pathSeparator +
		            "library" +
		            ::XYO::System::Shell::pathSeparator +
		            "electron" +
		            ::XYO::System::Shell::pathSeparator +
		            "electron.exe",
		        String("library") +
		            ::XYO::System::Shell::pathSeparator +
		            exeName +
		            ::XYO::System::Shell::pathSeparator +
		            "application.js",
		        exeFile, 0, false)) {
			MessageBox(nullptr, "#6 - Unable to create link", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		if (ShellExecute(NULL, "open", linkFile, NULL, NULL, SW_SHOWNORMAL) < (HINSTANCE)32) {
			MessageBox(nullptr, "#7 - Unable to execute link", msgBoxTitle, MB_OK | MB_ICONERROR);
			return 1;
		};

		return 0;
	};
};

XYO_APPLICATION_MAIN(WebDev::Application);
