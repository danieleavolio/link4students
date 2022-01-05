<script>
    import { goto } from "$app/navigation";
    
    
        export let corso;
        import { fly } from "svelte/transition";
    </script>
    
    <div transition:fly class="corso-lista" on:click={() => goto(`/corsodilaurea/corso/${corso.id}`)}>
        <div class="avatar">
            <p>{corso.data().nome[0]}</p>
        </div>
        <div class="nome">
            <p>{corso.data().nome}</p>
        </div>
    
    </div>
    
    <style>
        .corso-lista{
            width: 300px;
            height: 100px;
            border-radius: 0.5rem;
            padding: 1rem;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            justify-content: left;
            align-items: center;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
            margin: 1rem;
            cursor: pointer;
        }
    
        .avatar{
            width: 100px;
            height: 100px;
            border-radius: 100%;
            display: grid;
            place-items: center;
            background-color: blueviolet;
            font-size: 2rem;
        }
    </style>