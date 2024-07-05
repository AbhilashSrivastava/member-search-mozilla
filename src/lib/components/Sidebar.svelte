<script>
	import ShortlistedMember from './ShortlistedMember.svelte';
  import shortlist from '../stores/shortlist'
  
  export let width;
  let shortlistData = [];


  $: {
    shortlistData = $shortlist.members.map((member, index) => {
      return {
        id: member,
        image: $shortlist.imageDataURLs[index],
        profileUrl: member.html_url
      }
    })
  }
</script>

<div class="sidebar" style:width={$width + 'px'}>
  <div class='title'>Shortlists {$shortlist.count > 0 ? '(' +$shortlist.count + ')' : ''}</div>
  <div class='shortlisted-wrapper'>
   {#if $shortlist.count > 0}
    <div class='shortlist-list'>
      {#each shortlistData as shortlist, id(shortlist.id)}
        <ShortlistedMember {shortlist}/>
      {/each}
    </div>
   {:else}
    <div class='empty-shortlist'>No Shortlists Available</div>
    {/if}
  </div>
</div>

<style>
.shortlist-list{
  padding-bottom: 100px;
}
.shortlisted-wrapper {
  margin: 0 12px;
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-shortlist{
  height: 200px;
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
}
.title {
  background: #611e30;
  width: 100%;
  padding: 25px 0;
  color: white;
  text-align: center;
}
.sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    width: 400px;
    position: fixed;
    right: 0;
    top: 100px; 
    backdrop-filter: contrast(0.2);
    z-index: 1;
    box-shadow: -10px 0px 15px rgba(0, 0, 0, 0.2);
  }

</style>

