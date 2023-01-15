// Web Dev
// Copyright (c) 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#ifndef WEBDEV_COPYRIGHT_HPP
#define WEBDEV_COPYRIGHT_HPP

#ifndef WEBDEV_DEPENDENCY_HPP
#	include "Dependency.hpp"
#endif

namespace WebDev::Copyright {
	const char *copyright();
	const char *publisher();
	const char *company();
	const char *contact();
};

#endif
