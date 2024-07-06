<script>
  // Shortlist data is received from the parent (SideBar Component)
  export let shortlist;
</script>

<div class='shortlist-wrapper'>
  <img src={shortlist.image} alt="member Image {shortlist.id}" class='shortlist-image'/>
</div>

<style>
  .shortlist-wrapper {
    cursor: pointer;
    width: '100%';
  }
</style>
