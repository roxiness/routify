<script>
  import { isAncestor, layout, page } from '@roxi/routify'

  window.routify.isAncestor = isAncestor
  window.routify.layout = layout

  const nodes = {
    self: $page,
    child: $page.parent.children.find((node) => node.title === 'child'),
    sibling1: $page.parent.children.find((node) => node.title === 'sibling1'),
    sibling2: $page.parent.children.find((node) => node.title === 'sibling2'),
  }

  //   node1, node2, useIndex, expect
  const expectations = [
    ['self', 'child', false, true],
    ['self', 'child', true, true],
    ['child', 'self', false, false],
    ['child', 'self', true, false],
    ['self', 'sibling1', false, false],
    ['self', 'sibling1', true, true],
    ['sibling1', 'self', false, false],
    ['sibling1', 'self', true, false],
    ['sibling1', 'sibling2', false, false],
    ['sibling1', 'sibling2', true, false],
    ['sibling2', 'sibling1', false, false],
    ['sibling2', 'sibling1', true, false],
  ].map(([node1, node2, useIndex, expect]) => {
    const result = isAncestor(nodes[node1], nodes[node2], useIndex)
    return { node1, node2, useIndex, result, expect }
  })

  const errors = expectations.filter(({ result, expect }) => result !== expect)
</script>

<table>
  <tr>
    <th>name</th>
    <th>expected</th>
    <th>result</th>
  </tr>
  {#each expectations as { node1, node2, useIndex, result, expect }}
    <tr>
      <td>isAncestor({node1}, {node2}, {useIndex})</td>
      <td>{expect}</td>
      <td>{result}</td>
    </tr>
  {/each}
</table>

<h3>Errors</h3>
<div class="errors">
  {#each errors as error}
    <div>
      isAncestor({error.node1}, {error.node2}, {error.useIndex}) - expected {error.expect},
      but got {error.result}
    </div>
  {/each}
</div>
