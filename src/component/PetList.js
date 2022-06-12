import React, { useState, useEffect } from "react";

export default function PetList() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://5c92dbfae7b1a00014078e61.mockapi.io/owners");
        const data = await res.json();
        const petListByOwnerGenter = getPetListByOwnerGender(data)
        setPets(petListByOwnerGenter);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    }
    fetchPets();
  }, []);

  function getPetListByOwnerGender(data) {
      let pets = [];
      for (let item of data) {        
        pets = [
          ...pets,
          ...item.pets?.map(pet => {
              return {
                ...pet,
                ownerGender: item.gender
              }
          })||[]
        ]
      }
      pets.sort((a,b)=>a.name.localeCompare(b.name))
      return [
        {
          gender:"Male",
          catList:pets.filter(pet => {
            return pet.type==='Cat'&&pet.ownerGender === 'Male'
          })
        },
        {
          gender:"Female",
          catList:pets.filter(pet => {
            return pet.type==='Cat'&&pet.ownerGender === 'Female'
          })
        }  
      ]
  }

  return (
    <div className="pet-list">
      {error && <div style={{ color: "red" }}>Failed: {String(error)}</div>}
      {loading 
      ? <div className="loading">Loading...</div> 
      : <div>
        {pets.map((catListByOwnerGender,index) => {
          return (
          <div key={index}>
            <h3>{catListByOwnerGender.gender}</h3>
            <ul>
              {catListByOwnerGender.catList.length && catListByOwnerGender.catList.map((cat,index) => {
                return <li key={index}>{cat.name}</li>
              })}
            </ul>
          </div>
          )
      })}
      </div>}
    </div>
  );
}
