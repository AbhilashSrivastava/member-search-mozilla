<script>
  import tippy from '../helpers/Tippy'
  import FaInfoCircle from 'svelte-icons/fa/FaInfoCircle.svelte'

  // onSearch function is received from Layout container
  export let onSearch;
  
  // Content to be shown by our tooltip to educate our user about shortcures
  let tootTipContent = '1.ALT/OPTION + S - To export a member to shortlist.\n2.ALT/OPTION - To select all cards (in pan/zoom mode)\n3.CMD/Windows + Click - To open github profile of the member'

  
  const handleInput = (event) => {
    onSearch(event.target.value);
  }
</script>
  <div class='header-wrapper'>
    <div class='inner-wrapper search'>
      <div class='search-text'>Enter github name to search member</div>
      <input class='search-input' type="text" placeholder="Search members..." on:input={handleInput} />
    </div>
    <div class='shortcuts-wrapper icon' use:tippy={{ content: tootTipContent, placement: 'right', theme: 'light' }}>
      <FaInfoCircle />
    </div>
  </div>



<style>
  .icon {
    color: white;
    width: 32px;
    height: 32px;
  }
  .header-wrapper{
    backdrop-filter: blur(50px);
    margin-bottom: 14px;
    border: 1px solid white;
    padding: 2px 60px;
    border-radius: 24px;
    background-color: transparent;
    display: flex;
    align-items: center;
    flex-direction: row;
    transition: all ease-in-out 0.2s;
  }
  .inner-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 12px;
    width: 100%;
  }
  .search-text {
    font-size: 18px;
    margin-right: 12px;
    color: white;
  }

  .search-input{
    border: 1px solid green;
    width: 250px;
    padding: 12px;
    border-radius: 12px;
  }
  .shortcuts-wrapper{
    position: fixed;
    top: 20px;
    right: -40px;
  }
  

</style>
