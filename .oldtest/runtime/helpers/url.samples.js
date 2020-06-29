const throwsOutside = {
  throws: 'outside of app',
}

// expects: [
//   [input, expected], // $url(input) === expected
// ]

export const paths = [
  {
    // TODO keep?
    path: '',
    expects: [
      ['', ''],
      // relative
      ['.', '/'],
      ['./', '/'],
      ['..', throwsOutside],
      ['../', throwsOutside],
      ['./foo', '/foo'],
      ['../foo', throwsOutside],
      ['./foo/', '/foo/'],
      ['../foo/', throwsOutside],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
  {
    path: '/',
    expects: [
      ['', '/'],
      // relative
      ['.', '/'],
      ['./', '/'],
      ['..', throwsOutside],
      ['../', throwsOutside],
      ['./foo', '/foo'],
      ['../foo', throwsOutside],
      ['./foo/', '/foo/'],
      ['../foo/', throwsOutside],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
  {
    path: '/index',
    expects: [
      ['', '/index'],
      // relative
      ['.', '/'],
      ['./', '/'],
      ['..', throwsOutside],
      ['../', throwsOutside],
      ['./foo', '/foo'],
      ['../foo', throwsOutside],
      ['./foo/', '/foo/'],
      ['../foo/', throwsOutside],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
  {
    path: '/index/',
    expects: [
      ['', '/index/'],
      // relative
      ['.', '/index/'],
      ['./', '/index/'],
      ['..', '/'],
      ['../', '/'],
      ['./foo', '/index/foo'],
      ['../foo', '/foo'],
      ['./foo/', '/index/foo/'],
      ['../foo/', '/foo/'],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
  {
    path: '/a',
    expects: [
      ['', '/a'],
      // relative
      ['.', '/'],
      ['./', '/'],
      ['..', throwsOutside],
      ['../', throwsOutside],
      ['./foo', '/foo'],
      ['../foo', throwsOutside],
      ['./foo/', '/foo/'],
      ['../foo/', throwsOutside],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
  {
    path: '/a/',
    expects: [
      ['', '/a/'],
      // relative
      ['.', '/a/'],
      ['./', '/a/'],
      ['..', '/'],
      ['../', '/'],
      ['./foo', '/a/foo'],
      ['../foo', '/foo'],
      ['./foo/', '/a/foo/'],
      ['../foo/', '/foo/'],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
  {
    path: '/a/b/c',
    expects: [
      ['', '/a/b/c'],
      // relative
      ['.', '/a/b/'],
      ['./', '/a/b/'],
      ['..', '/a/'],
      ['../', '/a/'],
      ['./foo', '/a/b/foo'],
      ['../foo', '/a/foo'],
      ['./foo/', '/a/b/foo/'],
      ['../foo/', '/a/foo/'],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
  {
    path: '/a/b/c/',
    expects: [
      ['', '/a/b/c/'],
      // relative
      ['.', '/a/b/c/'],
      ['./', '/a/b/c/'],
      ['..', '/a/b/'],
      ['../', '/a/b/'],
      ['./foo', '/a/b/c/foo'],
      ['../foo', '/a/b/foo'],
      ['./foo/', '/a/b/c/foo/'],
      ['../foo/', '/a/b/foo/'],
      // absolute
      ['/foo', '/foo'],
      ['/foo/', '/foo/'],
      ['/', '/'],
      ['/a/b/c', '/a/b/c'],
      ['/a/b/c/', '/a/b/c/'],
    ],
  },
]
