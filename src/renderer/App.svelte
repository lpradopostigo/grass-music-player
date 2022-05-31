<script>
  export let name;
</script>

<style>
  :global(body) {
    background-color: #ff007d;
    color: white;
  }
  .main {
    display: flex;
    justify-content: center;
  }
</style>

<div class="main">
    <h1>Hello {name}!</h1>
</div>