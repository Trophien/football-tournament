import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Data from '../../data/Data';
import Modal from 'react-bootstrap/Modal';
import './Tournaments.scss';

function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [showAddTournamentModal, setShowAddTournamentModal] = useState(false);
  const [inputParticipantsValue, setInputParticipantsValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const totalPromotedOptions = [2, 4, 8, 16, 32, 64];
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    await Data.fetchTournaments();
    setTournaments(Data.tournaments);
  };

  const handleInputParticipantsChange = (event) => {
    setInputParticipantsValue(event.target.value);
  };

  const openTournament = (id) => {
    navigate(`/tournament/${id}`);
  }

  const addTournament = async (e) => {
    e.preventDefault();
    setShowAddTournamentModal(false);

    const form = e.target;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);

    // try {
    //   const id = await Data.addTournament();
    //   navigate(`/tournament/${id}`);
    // } catch (e) {}
  }

  const numbers = Array.from({ length: 62 }, (_, index) => index + 3);

  return (
    <div className="Tournaments container">
      <div className='row mb-3'>
        <div className='col-6'>
          <div className="d-flex align-items-center">
            <div className='d-inline'>
              <h1 className="mb-3">Tournaments</h1>
            </div>
            {isLoading && (
              <div className="spinner-border text-light d-inline ms-4 mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            )}
          </div>
        </div>
        <div className='col-6 d-flex justify-content-end align-items-center'>
          <div>
            <button className='btn btn-sm btn-success' onClick={() => setShowAddTournamentModal(true)}>Add tournament</button>
          </div>
        </div>
      </div>

      <div>
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="row row-box mb-4" onClick={() => openTournament(tournament.id)}>
            <div className="col-10 col-md-4 fw-semibold">
              {tournament.title}
            </div>
            <div className="col-md-4 d-none d-md-flex">
              {new Date(tournament.date).toISOString().slice(0, 10).replace(/-/g, '.')}
            </div>
            <div className="col-md-4 d-none d-md-flex">
              <button className="btn btn-primary btn-sm">Explore</button>
            </div>
          </div>
        ))}
      </div>

      <Modal onHide={() => setShowAddTournamentModal(false)} show={showAddTournamentModal}>
        <Modal.Header closeButton style={{ border: 0 }}>
          <Modal.Title>Add tournament</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form method='post' onSubmit={addTournament}>
            <div className="mb-3">
              <label htmlFor="inputTitle" className="form-label">Title</label>
              <input required type="text" className="form-control" id="inputTitle" name="title" />
              <div className="invalid-feedback">Title is required</div>
            </div>

            <label htmlFor="inputParticipants" className="form-label">Participants</label>
            <select
              className="form-select mb-3"
              aria-label="Default select example"
              value={inputParticipantsValue}
              onChange={handleInputParticipantsChange}
              name='participantsValue'
            >
              <option value="" disabled>
                Select a number
              </option>
              {numbers.map((number) => (
                <option key={number} value={number}>
                  {number}
                </option>
              ))}
            </select>

            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="flexSwitchCheckRoundRobin" name="roundRobin" />
              <label className="form-check-label" htmlFor="flexSwitchCheckRoundRobin">Round-robin</label>
            </div>

            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" id="flexSwitchCheckKnockout" name='knockout'/>
              <label className="form-check-label" htmlFor="flexSwitchCheckKnockout">Knockout</label>
            </div>

            <label htmlFor="inputTotalPromoted" className="form-label">Total Promoted</label>
            <select className="form-select mb-3" aria-label="Default select example" name='totalPromoted'>
              <option value="" disabled selected>
                Select a number
              </option>
              {totalPromotedOptions.filter((value) => value <= inputParticipantsValue).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* TODO: number of groups if round-robin is true */}

            <div className="row">
              <div className="col-5">
                <button className="btn btn-primary" type='submit'>Create</button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Tournaments;
