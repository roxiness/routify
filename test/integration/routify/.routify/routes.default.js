import _default from '../example/_module.svelte'
import _default_index_svelte from '../example/index.svelte'
import _default_blog_prefixed_slug__svelte from '../example/blog/prefixed[slug].svelte'
import _default_blog__slug__svelte from '../example/blog/[slug].svelte'
import _default_no_layouts_nested_foo_svelte from '../example/no-layouts/nested/foo.svelte'
import _default_no_layouts_nested_index_svelte from '../example/no-layouts/nested/index.svelte'

export const routes = {
  "meta": {},
  "component": _default,
  "id": "_default",
  "rootName": "default",
  "file": {
    "path": "test/integration/routify/example/_module.svelte",
    "dir": "test/integration/routify/example",
    "base": "_module.svelte",
    "ext": ".svelte",
    "name": "_module"
  },
  "children": [
    {
      "meta": {
        "bundle": true,
        "reset": true
      },
      "component": import("./bundles/_default_admin-bundle.js").then(r => r._default_admin),
      "id": "_default_admin",
      "name": "admin",
      "file": {
        "path": "test/integration/routify/example/admin/_reset.svelte",
        "dir": "test/integration/routify/example/admin",
        "base": "_reset.svelte",
        "ext": ".svelte",
        "name": "_reset"
      },
      "children": [
        {
          "meta": {},
          "component": import("./bundles/_default_admin-bundle.js").then(r => r._default_admin_bundleme_svelte),
          "id": "_default_admin_bundleme_svelte",
          "name": "bundleme",
          "file": {
            "path": "test/integration/routify/example/admin/bundleme.svelte",
            "dir": "test/integration/routify/example/admin",
            "base": "bundleme.svelte",
            "ext": ".svelte",
            "name": "bundleme"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "id": "_default_blog",
      "name": "blog",
      "file": {
        "path": "test/integration/routify/example/blog",
        "dir": "test/integration/routify/example",
        "base": "blog",
        "ext": "",
        "name": "blog"
      },
      "children": [
        {
          "meta": {
            "dynamic": true
          },
          "component": _default_blog_prefixed_slug__svelte,
          "id": "_default_blog_prefixed_slug__svelte",
          "name": "prefixed[slug]",
          "file": {
            "path": "test/integration/routify/example/blog/prefixed[slug].svelte",
            "dir": "test/integration/routify/example/blog",
            "base": "prefixed[slug].svelte",
            "ext": ".svelte",
            "name": "prefixed[slug]"
          },
          "children": []
        },
        {
          "meta": {
            "dynamic": true
          },
          "component": _default_blog__slug__svelte,
          "id": "_default_blog__slug__svelte",
          "name": "[slug]",
          "file": {
            "path": "test/integration/routify/example/blog/[slug].svelte",
            "dir": "test/integration/routify/example/blog",
            "base": "[slug].svelte",
            "ext": ".svelte",
            "name": "[slug]"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "component": _default_index_svelte,
      "id": "_default_index_svelte",
      "name": "index",
      "file": {
        "path": "test/integration/routify/example/index.svelte",
        "dir": "test/integration/routify/example",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "children": []
    },
    {
      "meta": {},
      "id": "_default_no_layouts",
      "name": "no-layouts",
      "file": {
        "path": "test/integration/routify/example/no-layouts",
        "dir": "test/integration/routify/example",
        "base": "no-layouts",
        "ext": "",
        "name": "no-layouts"
      },
      "children": [
        {
          "meta": {},
          "id": "_default_no_layouts_nested",
          "name": "nested",
          "file": {
            "path": "test/integration/routify/example/no-layouts/nested",
            "dir": "test/integration/routify/example/no-layouts",
            "base": "nested",
            "ext": "",
            "name": "nested"
          },
          "children": [
            {
              "meta": {},
              "component": _default_no_layouts_nested_foo_svelte,
              "id": "_default_no_layouts_nested_foo_svelte",
              "name": "foo",
              "file": {
                "path": "test/integration/routify/example/no-layouts/nested/foo.svelte",
                "dir": "test/integration/routify/example/no-layouts/nested",
                "base": "foo.svelte",
                "ext": ".svelte",
                "name": "foo"
              },
              "children": []
            },
            {
              "meta": {},
              "component": _default_no_layouts_nested_index_svelte,
              "id": "_default_no_layouts_nested_index_svelte",
              "name": "index",
              "file": {
                "path": "test/integration/routify/example/no-layouts/nested/index.svelte",
                "dir": "test/integration/routify/example/no-layouts/nested",
                "base": "index.svelte",
                "ext": ".svelte",
                "name": "index"
              },
              "children": []
            }
          ]
        }
      ]
    }
  ]
}