import React, { useEffect, useState } from 'react'
import axios from 'axios';

// önerilen başlangıç stateleri
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi
const gridSize = 3
export default function AppFunctional(props) {
  const [x, setX] = useState(initialIndex % gridSize); // X koordinatı
  const [y, setY] = useState(Math.floor(initialIndex / gridSize)); // Y koordinatı
  const [message, setMessage] = useState("");
  const [stepCount, setStepCount] = useState(initialSteps);
  const [email, setEmail] = useState("");

  // Koordinatları gridSize'a göre sınırlandırıp hareket yönlü güncelleyen bir fonksiyon //
  const updateCoordinates = (dx, dy) => {
    const newX = x + dx;
    const newY = y + dy;
    if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize) {
      setX(newX);
      setY(newY);
      setStepCount(stepCount + 1);
      setMessage("");
    }
    else if (newX >= gridSize || newX <= 0 || newY >= gridSize || newY <= 0) {
      setMessage("Daha fazla ilerleyemezsiniz.");
    }
  };

  // Şu anki koordinatları hesaplayan bir fonksiyon //
  const getCurrentCoordinates = () => {
    return `Koordinatlar (${x}, ${y})`;
  };

  //Reset işlemiyle bütün değerler inital Value'ya döner //
  function reset() {
    setX(initialIndex % gridSize);
    setY(Math.floor(initialIndex / gridSize));
    setMessage("");
    setStepCount(initialSteps);
  }

  //Email hareketini kontrol eden changeHandler //
  function onChange(e) {
    setEmail(e.target.value);
  }

  //submitHandler ile birlikte dataları JSON ile string olarak config yapısıyla post req //
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = JSON.stringify({
      x: x,
      y: y,
      steps: stepCount,
      email: email,
    });

    const config = {
      method: "post",
      url: "http://localhost:9000/api/result",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setMessage(JSON.stringify(response.data.message));
        setEmail(JSON.stringify(response.data.email));
      })
      .catch(function (error) {
        setMessage(`Geçerli bir email adresi giriniz.`)
        console.log(error);

      });
    setEmail("");
    setMessage("");
  };
  console.log(email);

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getCurrentCoordinates()} </h3>
        <h3 id="steps">{stepCount} kere ilerlediniz </h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === (y * gridSize) + x ? ' active' : ''}`}>
              {idx === (y * gridSize) + x ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message"> {message} </h3>
      </div>
      <div id="keypad">
        <button onClick={() => updateCoordinates(-1, 0)} id="left">SOL</button>
        <button onClick={() => updateCoordinates(0, -1)} id="up">YUKARI</button>
        <button onClick={() => updateCoordinates(1, 0)} id="right">SAĞ</button>
        <button onClick={() => updateCoordinates(0, 1)} id="down">AŞAĞI</button>
        <button onClick={() => { reset() }} id="reset">reset</button>
      </div>
      <form onSubmit={handleSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
