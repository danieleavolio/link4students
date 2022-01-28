<script lang="ts">

    export let social;

    let link:HTMLElement;

    const redirect = () =>{
        link.click();
    }
</script>


<div class="social">
    <img src="/images/logos/{social.social}.svg" on:click={redirect} alt="">
    <a target="_blank" bind:this={link} href="{social.url}"> </a>
</div>

<style>


.social{
    opacity: 50%;
    transition: all 0.5s ease;
    cursor: pointer;
}

.social:hover{
    opacity: 100%;
}

img{
    width: 75px;
    height: 75px;
    border-radius: 100%;
}

a{
    display: none;
}

@media screen and (max-width:450px){
    img{
        width: 60px;
        height: 60px;
    }
}

</style>