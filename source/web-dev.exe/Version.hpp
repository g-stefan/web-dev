// Web Dev
// Copyright (c) 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2023 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#ifndef WEBDEV_VERSION_HPP
#define WEBDEV_VERSION_HPP

#ifndef WEBDEV_DEPENDENCY_HPP
#	include "Dependency.hpp"
#endif

namespace XYO::Version {

	const char *version();
	const char *build();
	const char *versionWithBuild();
	const char *datetime();

};

#endif
