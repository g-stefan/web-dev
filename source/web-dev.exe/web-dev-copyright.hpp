//
// Web Dev
//
// Copyright (c) 2020-2022 Grigore Stefan <g_stefan@yahoo.com>
// Created by Grigore Stefan <g_stefan@yahoo.com>
//
// MIT License (MIT) <http://opensource.org/licenses/MIT>
//

#ifndef WEB_DEV_COPYRIGHT_HPP
#define WEB_DEV_COPYRIGHT_HPP

#define WEB_DEV_COPYRIGHT            "Copyright (c) Grigore Stefan."
#define WEB_DEV_PUBLISHER            "Grigore Stefan"
#define WEB_DEV_COMPANY              WEB_DEV_PUBLISHER
#define WEB_DEV_CONTACT              "g_stefan@yahoo.com"
#define WEB_DEV_FULL_COPYRIGHT       WEB_DEV_COPYRIGHT " <" WEB_DEV_CONTACT ">"

#ifndef XYO_RC

namespace WebDev {
	namespace Copyright {
		const char *copyright();
		const char *publisher();
		const char *company();
		const char *contact();
		const char *fullCopyright();
	};
};

#endif
#endif
