#
# Copyright (c) Microsoft. All rights reserved.
# Licensed under the MIT license. See LICENSE file in the project.
#

from pandas.testing import assert_frame_equal


def assert_frame_not_equal(*args, **kwargs):
    try:
        # if this assert fails then frames are different
        assert_frame_equal(*args, **kwargs)
    except AssertionError:
        # frames are not equal - pass the test
        pass
    else:
        # frames are equal - fail the test
        raise AssertionError
