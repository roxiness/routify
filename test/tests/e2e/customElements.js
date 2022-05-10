const test = require('../../playwright-test')

const initTest = async (page)=> {
  await page.goto('http://localhost:5000/customElements');
  // make sure the page does not fully render
  const elm = await page.$(`#renderTime`)
  return await elm.evaluate(node => node.innerHTML);
}

const afterRedirect = async (page) => {
  const elm = await page.$(`#renderTime`)
  return await elm.evaluate(node => node.innerHTML)
};


test('Links should not reload the page with simple link on custom element', async (t, page) => {
  const dateStart = await initTest(page);

  await page.click('"wc link simple"')
  t.assert(await page.$('"/customElements/linkSimple.svelte"'))

  const dateEnd = await afterRedirect(page)
  t.is(dateStart, dateEnd)
});


test('Links should not reload the page with complex DOM structure inside custom element', async (t, page) => {
  const dateStart = await initTest(page);
  
  await page.click('"wc link deep"')
  t.assert(await page.$('"/customElements/linkDeep.svelte"'))

  const dateEnd = await afterRedirect(page)
  t.is(dateStart, dateEnd)

})
test('Links should not reload the page when slotted inside custom element', async (t, page) => {
  const dateStart = await initTest(page);
  
  await page.click('"wc link slot"')
  t.assert(await page.$('"/customElements/linkSlot.svelte"'))

  const dateEnd = await afterRedirect(page)
  t.is(dateStart, dateEnd)
})