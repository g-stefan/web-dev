// Web Dev
// Copyright (c) 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// MIT License (MIT) <http://opensource.org/licenses/MIT>
// SPDX-FileCopyrightText: 2020-2024 Grigore Stefan <g_stefan@yahoo.com>
// SPDX-License-Identifier: MIT

#include "Copyright.hpp"
#include "Copyright.rh"

namespace WebDev::Copyright {

	static const char *copyright_ = WEBDEV_COPYRIGHT;
	static const char *publisher_ = WEBDEV_PUBLISHER;
	static const char *company_ = WEBDEV_COMPANY;
	static const char *contact_ = WEBDEV_CONTACT;

	const char *copyright() {
		return copyright_;
	};

	const char *publisher() {
		return publisher_;
	};

	const char *company() {
		return company_;
	};

	const char *contact() {
		return contact_;
	};

};
