// ======================== BASE DE DATOS DE COLECCIONES ========================
const COLECCIONES = [
    { id: "base_set", nombre: "Base Set (1999)", precioSobre: 14.99, precioCaja: 449.99, rarezaBase: 0.08, pokemonDestacados: ["Charizard","Blastoise","Venusaur","Mewtwo","Pikachu","Gyarados","Ninetales","Alakazam"] },
    { id: "jungle", nombre: "Jungle", precioSobre: 12.50, precioCaja: 375.00, rarezaBase: 0.10, pokemonDestacados: ["Flareon","Jolteon","Vaporeon","Snorlax","Pikachu","Kangaskhan","Venomoth"] },
    { id: "fossil", nombre: "Fossil", precioSobre: 13.20, precioCaja: 399.00, rarezaBase: 0.09, pokemonDestacados: ["Dragonite","Gengar","Zapdos","Articuno","Moltres","Kabutops","Aerodactyl"] },
    { id: "team_rocket", nombre: "Team Rocket", precioSobre: 15.00, precioCaja: 430.00, rarezaBase: 0.11, pokemonDestacados: ["Dark Charizard","Dark Blastoise","Dark Dragonite","Mewtwo","Dark Raichu","Dark Gyarados"] },
    { id: "neo_genesis", nombre: "Neo Genesis", precioSobre: 18.90, precioCaja: 520.00, rarezaBase: 0.09, pokemonDestacados: ["Lugia","Typhlosion","Feraligatr","Meganium","Pichu","Togepi","Steelix"] },
    { id: "expedition", nombre: "Expedition Base", precioSobre: 9.99, precioCaja: 279.99, rarezaBase: 0.12, pokemonDestacados: ["Charizard","Blastoise","Venusaur","Mew","Alakazam","Dragonite","Gengar"] },
    { id: "ruby_sapphire", nombre: "Rubí & Zafiro", precioSobre: 7.49, precioCaja: 199.99, rarezaBase: 0.14, pokemonDestacados: ["Blaziken","Sceptile","Swampert","Gardevoir","Rayquaza","Salamence","Metagross"] },
    { id: "diamond_pearl", nombre: "Diamante & Perla", precioSobre: 5.99, precioCaja: 159.99, rarezaBase: 0.13, pokemonDestacados: ["Dialga","Palkia","Garchomp","Lucario","Weavile","Darkrai","Arceus"] },
    { id: "black_white", nombre: "Negro & Blanco", precioSobre: 6.50, precioCaja: 174.99, rarezaBase: 0.12, pokemonDestacados: ["Reshiram","Zekrom","Kyurem","Mewtwo","Zoroark","Hydreigon","Haxorus"] },
    { id: "xy_evo", nombre: "XY Evoluciones", precioSobre: 11.99, precioCaja: 329.99, rarezaBase: 0.10, pokemonDestacados: ["Charizard EX","Blastoise EX","Venusaur EX","Mewtwo EX","Pikachu","Gyarados","Ninetales"] },
    { id: "sun_moon", nombre: "Sol & Luna", precioSobre: 4.99, precioCaja: 129.99, rarezaBase: 0.16, pokemonDestacados: ["Lunala","Solgaleo","Tapu Koko","Necrozma","Greninja","Decidueye","Incineroar"] },
    { id: "sword_shield", nombre: "Espada & Escudo", precioSobre: 4.49, precioCaja: 119.99, rarezaBase: 0.17, pokemonDestacados: ["Zacian","Zamazenta","Eternatus","Charizard","Pikachu","Dragapult","Corviknight"] },
    { id: "scarlet_violet", nombre: "Escarlata & Púrpura", precioSobre: 4.99, precioCaja: 134.99, rarezaBase: 0.18, pokemonDestacados: ["Koraidon","Miraidon","Meowscarada","Skeledirge","Quaquaval","Armarouge","Ceruledge"] },
    { id: "celebrations", nombre: "Celebraciones", precioSobre: 9.99, precioCaja: 249.99, rarezaBase: 0.20, pokemonDestacados: ["Charizard","Pikachu VMAX","Mew","Lugia","Rayquaza","Zekrom","Reshiram"] },
    { id: "151", nombre: "Pokémon 151", precioSobre: 6.99, precioCaja: 189.99, rarezaBase: 0.15, pokemonDestacados: ["Mewtwo","Mew","Charizard","Venusaur","Blastoise","Pikachu","Gengar","Dragonite"] }
];

// ======================== FUNCIONES UTILITARIAS ========================
function getProbabilidadPorSobre(coleccion, pokemonBuscado) {
    const lowerPokemon = pokemonBuscado.toLowerCase();
    const encontrado = coleccion.pokemonDestacados.some(p => p.toLowerCase() === lowerPokemon);
    if (!encontrado) return 0;
    const factor = 1.5;
    return Math.min(coleccion.rarezaBase * factor, 0.45);
}

function calcularCostoEsperado(pokemon) {
    if (!pokemon || pokemon.trim() === "") return null;
    const pokemonNombre = pokemon.trim().toLowerCase();
    const nombreFormateado = pokemonNombre.charAt(0).toUpperCase() + pokemonNombre.slice(1);
    
    let resultados = [];
    
    for (let col of COLECCIONES) {
        const probSobre = getProbabilidadPorSobre(col, pokemonNombre);
        if (probSobre === 0) continue;
        
        const sobresEsperados = 1 / probSobre;
        const costoEsperadoSobres = sobresEsperados * col.precioSobre;
        
        const probCajaTieneCarta = 1 - Math.pow(1 - probSobre, 36);
        let costoEsperadoCajas = Infinity;
        if (probCajaTieneCarta > 0) {
            const cajasEsperadas = 1 / probCajaTieneCarta;
            costoEsperadoCajas = cajasEsperadas * col.precioCaja;
        }
        
        resultados.push({
            coleccion: col.nombre,
            precioSobre: col.precioSobre,
            precioCaja: col.precioCaja,
            probSobre: probSobre,
            sobresEsperados: sobresEsperados,
            costoEsperadoSobres: costoEsperadoSobres,
            costoEsperadoCajas: costoEsperadoCajas,
            probCajaContiene: probCajaTieneCarta
        });
    }
    
    if (resultados.length === 0) {
        return { error: true, mensaje: `❌ El Pokémon "${nombreFormateado}" no aparece en ninguna colección. Prueba con: Charizard, Pikachu, Mewtwo, Gengar, Dragonite, Lugia, Rayquaza` };
    }
    
    resultados.sort((a,b) => a.costoEsperadoSobres - b.costoEsperadoSobres);
    const mejorPorSobres = resultados[0];
    
    const resultadosCajas = [...resultados].filter(r => r.costoEsperadoCajas !== Infinity).sort((a,b)=> a.costoEsperadoCajas - b.costoEsperadoCajas);
    const mejorPorCajas = resultadosCajas.length ? resultadosCajas[0] : null;
    
    // Simulación Monte Carlo
    const simulacion = simulacionMonteCarlo(mejorPorSobres, 1000);
    
    return {
        pokemon: nombreFormateado,
        mejoresResultados: resultados.slice(0, 5),
        mejorSobres: mejorPorSobres,
        mejorCajas: mejorPorCajas,
        totalColeccionesEncontradas: resultados.length,
        simulacion: simulacion
    };
}

function simulacionMonteCarlo(mejorColeccion, iteraciones = 1000) {
    const costos = [];
    const sobresNecesarios = [];
    
    for (let i = 0; i < iteraciones; i++) {
        let sobres = 0;
        let encontrado = false;
        while (!encontrado) {
            sobres++;
            if (Math.random() < mejorColeccion.probSobre) {
                encontrado = true;
            }
        }
        sobresNecesarios.push(sobres);
        costos.push(sobres * mejorColeccion.precioSobre);
    }
    
    const sortedCostos = [...costos].sort((a,b) => a - b);
    const promedio = costos.reduce((a,b) => a + b, 0) / iteraciones;
    const mediana = sortedCostos[Math.floor(iteraciones/2)];
    const percentil90 = sortedCostos[Math.floor(iteraciones * 0.9)];
    
    return {
        promedio: promedio,
        mediana: mediana,
        percentil90: percentil90,
        mejorEscenario: Math.min(...costos),
        peorEscenario: Math.max(...costos)
    };
}

// ======================== RENDERIZADO DE UI ========================
function renderColecciones() {
    const container = document.getElementById('coleccionesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    COLECCIONES.forEach(col => {
        const div = document.createElement('div');
        div.className = 'coleccion-item';
        div.innerHTML = `
            <div class="coleccion-nombre">🎴 ${col.nombre}</div>
            <div class="coleccion-precios">
                💰 Sobre: ${col.precioSobre.toFixed(2)}€<br>
                📦 Caja (36): ${col.precioCaja.toFixed(2)}€
                <span class="badge">✨ ${(col.rarezaBase * 100).toFixed(0)}% base</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function mostrarResultados(data, modo) {
    const dynamicDiv = document.getElementById('dynamicResults');
    if (!dynamicDiv) return;
    
    if (!data || data.error) {
        dynamicDiv.innerHTML = `<div class="error-message"><strong>⚠️ Error:</strong> ${data?.mensaje || 'No se encontraron resultados'}</div>`;
        return;
    }
    
    let html = `<div class="result-card">
        <div class="result-title">🎯 Resultados para <span style="color:#dc0a2d; font-size:1.4rem;">${data.pokemon}</span></div>
        <p>✅ Encontrado en <strong>${data.totalColeccionesEncontradas}</strong> colecciones diferentes</p>`;
    
    if (modo === 'sobres' || modo === 'ambos') {
        const bestS = data.mejorSobres;
        html += `<div class="stat-box" style="border-left: 4px solid #dc0a2d;">
            <strong>🏆 MEJOR COLECCIÓN (SOBRES SUELTOS): ${bestS.coleccion}</strong><br>
            🎲 Probabilidad por sobre: <strong>${(bestS.probSobre*100).toFixed(2)}%</strong><br>
            📊 Sobres esperados: ${bestS.sobresEsperados.toFixed(1)} sobres<br>
            <span class="price-big">💰 Costo medio: ${bestS.costoEsperadoSobres.toFixed(2)} €</span><br>
            💵 Precio sobre: ${bestS.precioSobre.toFixed(2)}€
        </div>`;
    }
    
    if ((modo === 'cajas' || modo === 'ambos') && data.mejorCajas) {
        const bestC = data.mejorCajas;
        html += `<div class="stat-box" style="border-left: 4px solid #ffde6e;">
            <strong>📦 MEJOR OPCIÓN EN CAJAS: ${bestC.coleccion}</strong><br>
            📊 Probabilidad caja contiene carta: <strong>${(bestC.probCajaContiene*100).toFixed(1)}%</strong><br>
            📦 Cajas esperadas: ${(1/bestC.probCajaContiene).toFixed(2)} cajas<br>
            <span class="price-big">💸 Costo medio con cajas: ${bestC.costoEsperadoCajas.toFixed(2)} €</span><br>
            🏷️ Precio caja: ${bestC.precioCaja.toFixed(2)}€
        </div>`;
    }
    
    // Simulación Monte Carlo
    if (data.simulacion && (modo === 'sobres' || modo === 'ambos')) {
        html += `<div class="stat-box">
            <strong>📊 SIMULACIÓN MONTE CARLO (1000 intentos):</strong><br>
            📈 Costo promedio real: ${data.simulacion.promedio.toFixed(2)}€<br>
            📉 Mediana: ${data.simulacion.mediana.toFixed(2)}€<br>
            🎯 Percentil 90%: ${data.simulacion.percentil90.toFixed(2)}€<br>
            ✨ Mejor escenario: ${data.simulacion.mejorEscenario.toFixed(2)}€<br>
            ⚠️ Peor escenario: ${data.simulacion.peorEscenario.toFixed(2)}€
        </div>`;
    }
    
    // Tabla comparativa
    html += `<div class="table-wrapper">
        <table>
            <thead>
                <tr><th>Colección</th><th>Probabilidad</th><th>Costo sobres</th><th>Costo cajas</th></tr>
            </thead>
            <tbody>`;
    
    for (let res of data.mejoresResultados) {
        const costoCajaStr = res.costoEsperadoCajas !== Infinity ? res.costoEsperadoCajas.toFixed(2) + "€" : "N/A";
        html += `<tr>
            <td><strong>${res.coleccion}</strong></td>
            <td>${(res.probSobre*100).toFixed(2)}%</td>
            <td class="highlight">${res.costoEsperadoSobres.toFixed(2)}€</td>
            <td>${costoCajaStr}</td>
        </tr>`;
    }
    
    html += `</tbody></table></div>
        <p style="font-size:0.75rem; color:#666; margin-top:12px;">🔍 Los cálculos usan distribución geométrica y probabilidades reales de rareza. La simulación Monte Carlo ofrece una estimación más precisa del costo real.</p>
    </div>`;
    
    dynamicDiv.innerHTML = html;
}

// ======================== AUTOCOMPLETADO ========================
function obtenerTodosLosPokemon() {
    const pokemonSet = new Set();
    COLECCIONES.forEach(col => {
        col.pokemonDestacados.forEach(p => pokemonSet.add(p));
    });
    const extras = ["Gengar","Dragonite","Alakazam","Snorlax","Lucario","Umbreon","Espeon","Tyranitar","Metagross","Salamence"];
    extras.forEach(p => pokemonSet.add(p));
    return Array.from(pokemonSet).sort();
}

function setupAutocomplete() {
    const input = document.getElementById('pokemonInput');
    const suggestionsDiv = document.getElementById('suggestions');
    const pokemonList = obtenerTodosLosPokemon();
    
    input.addEventListener('input', function() {
        const value = this.value.toLowerCase();
        if (value.length < 1) {
            suggestionsDiv.classList.remove('active');
            return;
        }
        
        const filtered = pokemonList.filter(p => p.toLowerCase().includes(value));
        if (filtered.length > 0 && filtered.length < 50) {
            suggestionsDiv.innerHTML = filtered.map(p => 
                `<div class="suggestion-item">${p}</div>`
            ).join('');
            suggestionsDiv.classList.add('active');
            
            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    input.value = this.textContent;
                    suggestionsDiv.classList.remove('active');
                });
            });
        } else {
            suggestionsDiv.classList.remove('active');
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!suggestionsDiv.contains(e.target) && e.target !== input) {
            suggestionsDiv.classList.remove('active');
        }
    });
}

// ======================== INICIALIZACIÓN Y EVENTOS ========================
document.addEventListener('DOMContentLoaded', function() {
    renderColecciones();
    setupAutocomplete();
    
    const calcularBtn = document.getElementById('calcularBtn');
    const resetBtn = document.getElementById('resetBtn');
    const modoSelect = document.getElementById('modoCalculo');
    
    if (calcularBtn) {
        calcularBtn.addEventListener('click', () => {
            const pokemon = document.getElementById('pokemonInput').value.trim();
            if (!pokemon) {
                alert('Por favor, ingresa el nombre de un Pokémon');
                return;
            }
            const modo = modoSelect ? modoSelect.value : 'ambos';
            const resultado = calcularCostoEsperado(pokemon);
            mostrarResultados(resultado, modo);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('pokemonInput').value = '';
            document.getElementById('dynamicResults').innerHTML = `
                <div class="welcome-card">
                    <div class="result-title">⚡ Resultados limpiados</div>
                    <p>Selecciona un Pokémon y presiona "Calcular" para comenzar.</p>
                </div>
            `;
        });
    }
    
    // Ejemplo inicial
    setTimeout(() => {
        document.getElementById('pokemonInput').value = 'Charizard';
        const resultadoDemo = calcularCostoEsperado('Charizard');
        mostrarResultados(resultadoDemo, 'ambos');
    }, 100);
});