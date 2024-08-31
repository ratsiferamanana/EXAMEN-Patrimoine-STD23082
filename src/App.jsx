// src/App.jsx

// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Graphique from "./components/Graphique"; // Assurez-vous que le chemin est correct
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import { Button, Table, Form, Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import Possession from "./patrimoine/models/possessions/Possession.js"; // Assurez-vous que le chemin est correct

function App() {
    const [possessions, setPossessions] = useState([]);
    const [totalValue, setTotalValue] = useState(0);
    const [endDate, setEndDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [currentPossession, setCurrentPossession] = useState(null);
    const [newPossession, setNewPossession] = useState({
        id: '',
        libelle: '',
        valeur: 0,
        dateDebut: new Date(),
        dateFin: null,
        tauxAmortissement: 0,
    });

    useEffect(() => {
        fetch("http://localhost:5000/possessions")
            .then((response) => response.json())
            .then((data) => setPossessions(data))
            .catch((error) => console.error("Error fetching possessions:", error));
    }, []);

    const calculateTotalValue = () => {
        const total = possessions.reduce((acc, poss) => {
            const possessionInstance = new Possession(
                poss.possesseur,
                poss.libelle,
                poss.valeur,
                new Date(poss.dateDebut),
                poss.dateFin ? new Date(poss.dateFin) : null,
                poss.tauxAmortissement
            );
            return acc + possessionInstance.getValeur(endDate);
        }, 0);
        setTotalValue(total);
    };

    useEffect(() => {
        calculateTotalValue();
    }, [endDate, possessions]);

    const handleCreate = () => {
        fetch("http://localhost:5000/possessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPossession),
        })
            .then((response) => response.json())
            .then((createdPossession) => {
                setPossessions([...possessions, createdPossession]);
                setShowModal(false);
            })
            .catch((error) => console.error("Error creating possession:", error));
    };

    const handleUpdate = () => {
        fetch(`http://localhost:5000/possessions/${newPossession.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPossession),
        })
            .then((response) => response.json())
            .then((updatedPossession) => {
                setPossessions(
                    possessions.map((p) =>
                        p.id === updatedPossession.id ? updatedPossession : p
                    )
                );
                setShowModal(false);
            })
            .catch((error) => console.error("Error updating possession:", error));
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/possessions/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                setPossessions(possessions.filter((p) => p.id !== id));
            })
            .catch((error) => console.error("Error deleting possession:", error));
    };

    const handleShowModal = (possession = null) => {
        if (possession) {
            setNewPossession(possession);
        } else {
            setNewPossession({
                id: '',
                libelle: '',
                valeur: 0,
                dateDebut: new Date(),
                dateFin: null,
                tauxAmortissement: 0,
            });
        }
        setCurrentPossession(possession);
        setShowModal(true);
    };

    return (
        <div className="container mt-4">
            <h1 className="mb-4 text-center">Gestion de Patrimoine</h1>
            <Form.Group controlId="formEndDate" className="mb-3">
                <Form.Label>Date de Fin</Form.Label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    dateFormat="dd/MM/yyyy"
                    className="form-control"
                />
            </Form.Group>
            <Button variant="primary" className="mt-3" onClick={calculateTotalValue}>
                Calculer la valeur totale
            </Button>
            <Button variant="success" className="mt-3" onClick={() => handleShowModal()}>
                Ajouter une Possession
            </Button>

            <Table striped bordered hover responsive className="mt-4">
                <thead className="thead-dark">
                <tr>
                    <th>Libellé</th>
                    <th>Valeur Initiale</th>
                    <th>Date Début</th>
                    <th>Date Fin</th>
                    <th>Amortissement (%)</th>
                    <th>Valeur Actuelle</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {possessions.map((poss, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-light' : 'bg-secondary text-white'}>
                        <td>{poss.libelle}</td>
                        <td>{poss.valeur.toFixed(2)} €</td>
                        <td>{new Date(poss.dateDebut).toLocaleDateString()}</td>
                        <td>{poss.dateFin ? new Date(poss.dateFin).toLocaleDateString() : 'N/A'}</td>
                        <td>{poss.tauxAmortissement ? poss.tauxAmortissement.toFixed(2) : 'N/A'} %</td>
                        <td>{new Possession(
                            poss.possesseur,
                            poss.libelle,
                            poss.valeur,
                            new Date(poss.dateDebut),
                            poss.dateFin ? new Date(poss.dateFin) : null,
                            poss.tauxAmortissement
                        ).getValeur(endDate).toFixed(2)} €
                        </td>
                        <td>
                            <Button variant="warning" onClick={() => handleShowModal(poss)}>
                                Modifier
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(poss.id)} className="ms-2">
                                Supprimer
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <div className="mt-4">
                <h3>Total du Patrimoine : {totalValue.toFixed(2)} €</h3>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{currentPossession ? "Modifier" : "Ajouter"} une Possession</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Libellé</Form.Label>
                            <Form.Control
                                type="text"
                                value={newPossession.libelle}
                                onChange={(e) => setNewPossession({ ...newPossession, libelle: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Valeur</Form.Label>
                            <Form.Control
                                type="number"
                                value={newPossession.valeur}
                                onChange={(e) => setNewPossession({ ...newPossession, valeur: parseFloat(e.target.value) })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date de Début</Form.Label>
                            <DatePicker
                                selected={newPossession.dateDebut}
                                onChange={(date) => setNewPossession({ ...newPossession, dateDebut: date })}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date de Fin</Form.Label>
                            <DatePicker
                                selected={newPossession.dateFin}
                                onChange={(date) => setNewPossession({ ...newPossession, dateFin: date })}
                                dateFormat="dd/MM/yyyy"
                                className="form-control"
                                isClearable
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            {/* eslint-disable-next-line react/no-unescaped-entities */}
                            <Form.Label>Taux d'Amortissement (%)</Form.Label>
                            <Form.Control
                                type="number"
                                value={newPossession.tauxAmortissement}
                                onChange={(e) => setNewPossession({ ...newPossession, tauxAmortissement: parseFloat(e.target.value) })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Fermer
                    </Button>
                    <Button variant="primary" onClick={currentPossession ? handleUpdate : handleCreate}>
                        {currentPossession ? "Modifier" : "Ajouter"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Graphique possessions={possessions} />
        </div>
    );
}

export default App;

