<script>
    import { goto } from "$app/navigation";
    
    
        export let appunto;
    </script>
    
    <div class="appunto-lista">
        <div class="avatar">
            <p>{appunto.data().titoloAppunti[0]}</p>
        </div>
        <div class="nome">
            <p>{appunto.data().titoloAppunti}</p>
        </div>
        {#if appunto.data().revisionato}
            <a href={appunto.data().urlAppunti} download={appunto.data().titoloAppunti} target="_blank">Download</a>
            {:else}
            <button disabled>Non disponibile</button>
        {/if}
    
    </div>
    
    <style>
        .appunto-lista{
            width: 300px;
            height: 100px;
            border-radius: 0.5rem;
            padding: 1rem;
            display: flex;
            gap: 1rem;
            justify-content: left;
            align-items: center;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            margin: 1rem;
        }
    
        .avatar{
            width: 100px;
            height: 100px;
            border-radius: 100%;
            display: grid;
            place-items: center;
            background-color: blueviolet;
            color: white;
            font-size: 2rem;
            font-weight: 600;
        }

        a{
            text-decoration: none;
            background-color: blueviolet;
            padding: 0.3rem;
            font-size: 1.2rem;
            color: white;
            border-radius: 0.5rem;
            transition: all 0.5s ease;
        }

        a:hover{
            background-color: purple ;
        }
    </style>