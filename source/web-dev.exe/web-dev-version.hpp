//
// Web Dev
//
// Copyright (c) 2020-2021 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef WEB_DEV_VERSION_HPP
#define WEB_DEV_VERSION_HPP

#define WEB_DEV_VERSION_ABCD                1,2,0,15
#define WEB_DEV_VERSION_STR                 "1.2.0"
#define WEB_DEV_VERSION_STR_BUILD           "15"
#define WEB_DEV_VERSION_STR_DATETIME        "2021-07-11 13:07:18"

#ifndef XYO_RC

namespace WebDev {
	namespace Version {
		const char *version();
		const char *build();
		const char *versionWithBuild();
		const char *datetime();
	};
};

#endif
#endif

