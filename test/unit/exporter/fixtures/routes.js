import _default from '../example/_module.svelte'
import _default_admin from '../example/admin/_reset.svelte'
import _default_index_svelte from '../example/index.svelte'
import _default_admin_index_svelte from '../example/admin/index.svelte'
import _default_admin_page_svelte from '../example/admin/page.svelte'
import _default_blog__slug__svelte from '../example/blog/[slug].svelte'
import _default_blog_prefixed_slug__svelte from '../example/blog/prefixed[slug].svelte'

export const routes = {
  "meta": {},
  "component": _default,
  "id": "_default",
  "rootName": "default",
  "file": {
    "path": "test/unit/exporter/example/_module.svelte",
    "dir": "test/unit/exporter/example",
    "base": "_module.svelte",
    "ext": ".svelte",
    "name": "_module"
  },
  "children": [
    {
      "meta": {
        "reset": true
      },
      "component": _default_admin,
      "id": "_default_admin",
      "name": "admin",
      "file": {
        "path": "test/unit/exporter/example/admin/_reset.svelte",
        "dir": "test/unit/exporter/example/admin",
        "base": "_reset.svelte",
        "ext": ".svelte",
        "name": "_reset"
      },
      "children": [
        {
          "meta": {},
          "component": _default_admin_index_svelte,
          "id": "_default_admin_index_svelte",
          "name": "index",
          "file": {
            "path": "test/unit/exporter/example/admin/index.svelte",
            "dir": "test/unit/exporter/example/admin",
            "base": "index.svelte",
            "ext": ".svelte",
            "name": "index"
          },
          "children": []
        },
        {
          "meta": {},
          "component": _default_admin_page_svelte,
          "id": "_default_admin_page_svelte",
          "name": "page",
          "file": {
            "path": "test/unit/exporter/example/admin/page.svelte",
            "dir": "test/unit/exporter/example/admin",
            "base": "page.svelte",
            "ext": ".svelte",
            "name": "page"
          },
          "children": []
        }
      ]
    },
    {
      "meta": {},
      "component": false,
      "id": "_default_blog",
      "name": "blog",
      "file": {
        "path": "test/unit/exporter/example/blog",
        "dir": "test/unit/exporter/example",
        "base": "blog",
        "ext": "",
        "name": "blog"
      },
      "children": [
        {
          "meta": {
            "dynamic": true
          },
          "component": _default_blog__slug__svelte,
          "id": "_default_blog__slug__svelte",
          "name": "[slug]",
          "file": {
            "path": "test/unit/exporter/example/blog/[slug].svelte",
            "dir": "test/unit/exporter/example/blog",
            "base": "[slug].svelte",
            "ext": ".svelte",
            "name": "[slug]"
          },
          "children": []
        },
        {
          "meta": {
            "dynamic": true
          },
          "component": _default_blog_prefixed_slug__svelte,
          "id": "_default_blog_prefixed_slug__svelte",
          "name": "prefixed[slug]",
          "file": {
            "path": "test/unit/exporter/example/blog/prefixed[slug].svelte",
            "dir": "test/unit/exporter/example/blog",
            "base": "prefixed[slug].svelte",
            "ext": ".svelte",
            "name": "prefixed[slug]"
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
        "path": "test/unit/exporter/example/index.svelte",
        "dir": "test/unit/exporter/example",
        "base": "index.svelte",
        "ext": ".svelte",
        "name": "index"
      },
      "children": []
    }
  ]
}