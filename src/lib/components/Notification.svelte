<script>
    import { onMount } from "svelte";
    import { spring } from "svelte/motion";
    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
  
    export let message = "";
    export let type = "info";
    export let timing = 3000;
  
    let show = false;
    let y = spring(-100, { stiffness: 0.1, damping: 0.3 });
  
    onMount(() => {
      show = true;
      y.set(0);
  
      const timer = setTimeout(() => {
        y.set(-100);
        show = false;
      }, timing);
  
      return () => clearTimeout(timer);
    });
  
    const notificationClasses = `notification ${type}`;
  </script>
  
  <style>
    .notification {
      position: fixed;
      top: 1rem;
      left: 1rem;
      padding: 1rem;
      border-radius: 0.5rem;
      color: white;
      font-weight: bold;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  
    .info {
      background-color: #342298;
    }
  
    .success {
      background-color: #35d24d;
    }
  
    .error {
      background-color: #892f35;
    }
  
    .warning {
      background-color: #e6d46f;
      color: #333;
    }
  </style>
  
  {#if show}
    <div class={notificationClasses} transition:fly="{{ y: 200, duration: 400, easing: cubicOut }}">
      {message}
    </div>
  {/if}
  