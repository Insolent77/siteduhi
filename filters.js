// Styled filter menus retain native selects as the catalog's source of truth.
const filterMenus=[];
const heading=document.createElement('div');
heading.className='filters-heading';
heading.innerHTML='<div><span class="eyebrow">ВАШ ИДЕАЛЬНЫЙ АРОМАТ</span><h3>Найдите своё сочетание</h3></div><span class="filter-hint">Уточните поиск по вашим предпочтениям</span>';
filters.prepend(heading);
function closeFilterMenus(except){filterMenus.forEach(menu=>{if(menu!==except){menu.panel.hidden=true;menu.button.setAttribute('aria-expanded','false')}})}
filters.querySelectorAll('select').forEach(select=>{
  const label=select.parentElement;
  const title=label.firstChild.textContent.trim();
  const wrapper=document.createElement('div');wrapper.className='filter-field';
  const caption=document.createElement('span');caption.className='filter-caption';caption.textContent=title;
  const button=document.createElement('button');button.type='button';button.className='filter-trigger';button.setAttribute('aria-expanded','false');
  const panel=document.createElement('div');panel.className='filter-menu';panel.id=select.id+'-menu';panel.hidden=true;
  button.setAttribute('aria-controls',panel.id);
  const value=document.createElement('span');button.append(value);button.insertAdjacentHTML('beforeend','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>');
  const menu={button,panel,select,value};filterMenus.push(menu);
  [...select.options].forEach(option=>{const item=document.createElement('button');item.type='button';item.className='filter-option';item.textContent=option.text;item.dataset.value=option.value;item.onclick=()=>{select.value=option.value;select.dispatchEvent(new Event('input',{bubbles:true}));closeFilterMenus();button.focus()};panel.append(item)});
  button.onclick=()=>{const open=panel.hidden;closeFilterMenus();panel.hidden=!open;button.setAttribute('aria-expanded',String(open));if(open)panel.querySelector('[aria-pressed="true"]')?.focus()};
  panel.onkeydown=event=>{const options=[...panel.children],index=options.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();const target=event.key==='Home'?0:event.key==='End'?options.length-1:(index+(event.key==='ArrowDown'?1:-1)+options.length)%options.length;options[target].focus()}if(event.key==='Escape'){event.stopPropagation();closeFilterMenus();button.focus()}};
  select.hidden=true;select.tabIndex=-1;wrapper.append(caption,button,panel,select);label.replaceWith(wrapper);
});
const chips=document.createElement('div');chips.className='filter-chips';filters.append(chips);
function syncFilterMenus(){filterMenus.forEach(({select,button,value,panel})=>{value.textContent=select.selectedOptions[0].text;button.setAttribute('aria-label',select.parentElement.querySelector('.filter-caption').textContent+': '+value.textContent);button.classList.toggle('has-value',!!select.value);panel.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',item.dataset.value===select.value))});chips.replaceChildren();filters.querySelectorAll('select,input').forEach(control=>{if(!control.value)return;const chip=document.createElement('button');chip.className='filter-chip';chip.type='button';const text=control.tagName==='SELECT'?control.selectedOptions[0].text:'До '+money(Number(control.value));chip.textContent=text+' ×';chip.setAttribute('aria-label','Убрать фильтр: '+text);chip.onclick=()=>{control.value='';render()};chips.append(chip)});chips.hidden=!chips.children.length}
const renderWithFilters=render;render=function(){renderWithFilters();syncFilterMenus()};
document.addEventListener('click',event=>{if(!event.target.closest('.filter-field'))closeFilterMenus()});
document.addEventListener('focusin',event=>{if(!event.target.closest('.filter-field'))closeFilterMenus()});
syncFilterMenus();
