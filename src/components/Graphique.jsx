// src/components/Graphique.js

// eslint-disable-next-line no-unused-vars
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import Possession from "../patrimoine/models/possessions/Possession.js";

// Enregistrer les composants nécessaires de Chart.js pour un graphique en ligne
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// eslint-disable-next-line react/prop-types
const Graphique = ({ possessions }) => {
    // Préparer les données pour le graphique en ligne
    const data = {
        // eslint-disable-next-line react/prop-types
        labels: possessions.map(pos => pos.libelle),  // Labels sur l'axe des X (libellés des possessions)
        datasets: [
            {
                label: 'Valeur Actuelle',
                // eslint-disable-next-line react/prop-types
                data: possessions.map(pos => new Possession(
                    pos.possesseur,
                    pos.libelle,
                    pos.valeur,
                    new Date(pos.dateDebut),
                    pos.dateFin ? new Date(pos.dateFin) : null,
                    pos.tauxAmortissement
                ).getValeur(new Date()).toFixed(2)),  // Valeurs sur l'axe des Y (valeurs actuelles)
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,  // Ne pas remplir sous la ligne
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Valeur Actuelle: ${context.raw} €`;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,  // Commencer l'axe Y à zéro
            },
        },
    };

    return (
        <div>
            <h2>Valeur Actuelle des Possessions (Graphique en Ligne)</h2>
            <Line data={data} options={options} />
        </div>
    );
};

export default Graphique;
