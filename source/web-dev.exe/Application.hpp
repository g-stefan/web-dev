// Web Dev
// Copyright (c) 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#ifndef WEBDEV_APPLICATION_HPP
#define WEBDEV_APPLICATION_HPP

#ifndef WEBDEV_DEPENDENCY_HPP
#	include "Dependency.hpp"
#endif

namespace WebDev {

	class Application : public virtual IApplication {
			XYO_DISALLOW_COPY_ASSIGN_MOVE(Application);

		public:
			static char *msgBoxTitle;

			inline Application(){};

			void showUsage();
			void showLicense();
			void showVersion();

			int main(int cmdN, char *cmdS[]);

			static void initMemory();
	};

};

#endif
