import React, { Component, useState, useEffect, useRef } from "react";
import "../styles/Crime_list.scss";
import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react"
import Axios from "axios";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, doc, onSnapshot } from "firebase/firestore";
import {db, storage} from "../firebase"
import {LazyLoadImage} from "react-lazy-load-image-component"
import 'react-lazy-load-image-component/src/effects/blur.css'
import Gif from '../Loading2.gif';


const CrimeList = () => {
  //funcion para sacar los reportes del back
  function getListadoData() {
    Axios.get('https://us-central1-miproyecto-5cf83.cloudfunctions.net/app/reports')
      .then((response) => {
        setListado(response.data)
        console.log(response)
        num.current += 1;
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("tipo reporte",reportType)
    getListadoByFilter();
}

const getListadoByFilter = () => {
  Axios.get(`https://us-central1-miproyecto-5cf83.cloudfunctions.net/app/reportByFilter?lowerDate=${lowerDate}&upperDate=${upperDate}&reportType=${reportType}`).then((response) => {
      listado.pop();
      setListado(response.data)
  }).catch((error) => console.log(error));
}
  const [showModal, setShowModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [activeObject, setActiveObject] = useState(null);
  const [listado, setListado] = useState([])
  const [lowerDate, setLowerDate] = useState("");
  const [upperDate, setUpperDate] = useState("");
  const [reportType, setReportType] = useState("TODOS");
  const [container, setContainer] = useState("modal-container")
  function getClass(index) {
    return index === activeObject?.id ? "active" : "inactive";
  }
  const mapStyles = {
    width: "43.5%",
    height: "46%"
  }
  async function getFotos(id, imagesids, setListadofotos) {
    let aux = [];

    for (const imag of imagesids) {
      const URL = await getDownloadURL(ref(storage, "reports/" + id + "/media/images/" + imag));
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', URL);
      xhr.send();
      aux.push(URL);
    }

    setListadofotos(aux);

  }
  const num = useRef(0);
  const Modal = (props) => {

    const [listadofotos, setListadofotos] = useState([])
    useEffect(() => {
      getFotos(props.object.fotourl, props.object.imagenes, setListadofotos);
    }, [])
    
    return (
      <div id="CrimeListtModal" className="active modal" >
        <div className={props.container}>
          <div className="fotos">
            {props.object.hasFotos && listadofotos.length == 0 ? (<img src={Gif} style={{ width: 300, height: 300 , marginTop: 160 }}/>) : "" }
                
            {listadofotos.length == 1 ?
              <LazyLoadImage src={listadofotos[0]} effect="blur" placeholderSrc="https://skillz4kidzmartialarts.com/wp-content/uploads/2017/04/default-image.jpg" className="imgu" style={{ width: 300, height: 300 }}></LazyLoadImage>
             :
             (listadofotos.map((image,i) => (
              <LazyLoadImage src={listadofotos[i]} className="img" effect="blur" placeholderSrc="https://skillz4kidzmartialarts.com/wp-content/uploads/2017/04/default-image.jpg" style={{ width: 300, height: 300 }}></LazyLoadImage>
            ) ))  
            }
          </div>
          <div className="report">
            <button className="modalboton" onClick={() => setShowModal(false)}>X</button>
            <h1 className="asunto" style={{color : props.object.color}}>{props.object.asunto}</h1>
            <span className="TipoAlerta" style={{color : props.object.color}}>{props.object.tipo_reporte}</span>
            <br></br>
            <span className="Descripcion" style={{color : props.object.color}}>{props.object.descripcion}</span>
            <br></br>
            <span className="fecha" style={{color : props.object.color}}>{props.object.fecha} {props.object.hora}</span>
            <br></br>
            <span className="horam" style={{color : props.object.color}}>{props.object.user_phone}</span>
            <br></br>
            <Map google={google} zoom={16} style={mapStyles} initialCenter={{ lat: parseFloat(props.object.latitude), lng: parseFloat(props.object.longitude) }}>
              <Marker position={{ lat: props.object.latitude, lng: props.object.longitude }} />
            </Map>
          </div>
        </div>
      </div>

    );
  }

  return (
    <>

      <h1 className="title"> Listado de crimenes</h1>
      <form className="card-mapfilter-container" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="lowerDate">Desde</label><br/>
                    <input id="lowerDate" type="date" required onChange={(e) => {setLowerDate(e.target.value)}} />
                </div>
                <div>
                    <label htmlFor="upperDate">Hasta</label><br/>
                    <input id="upperDate" type="date" required onChange={(e) => {setUpperDate(e.target.value)}}/>
                </div>
                <div>
                    <label htmlFor="reportType">Tipo de reporte</label><br/>
                    <select id="reportType" required onChange={(e) => {setReportType(e.target.value)}}>
                        <option key="todos" value="TODOS">Todos</option>
                        <option key="hurtoVivienda" value="HURTO_VIVIENDA">Hurto Vivienda</option>
                        <option key="hurtoPersona" value="HURTO_PERSONA">Hurto Persona</option>
                        <option key="hurtoVehiculo" value="HURTO_VEHICULO">Hurto Vehículo</option>
                        <option key="vandalismo" value="VANDALISMO">Vandalismo</option>
                        <option key="violacion" value="VIOLACION">Violación</option>
                        <option key="homicidio" value="HOMICIDIO">Homicidio</option>
                        <option key="agresion" value="AGRESION">Agresión</option>
                        <option key="otro" value="OTRO">Otro</option>
                    </select>
                </div>
                <button type="submit">Aplicar filtros a la lista</button>
            </form>
            <br></br>

      {useEffect(() => {
          const ref = collection(db , "reports");
          onSnapshot(ref , (snapshot) => {
            listado.pop();
            getListadoData();
            setShowLoading(true)
          });
         getListadoData(); 
         if(showLoading)        
         alert("Se realizo un nuevo reporte"); 
        
      }, [])}
      {listado.length == 0 ? <img src={Gif} className="carga"/> : ""}
      <ul className="list-menu">
        {listado.map((item) => (
          <div className="Container-crime" style={{borderColor : item.color}}>
            <span className="time">{item.fecha}</span> <span className="hora">{item.hora}</span>
            <h2>{item.asunto}</h2>
            <span className="description">{item.descripcion}</span>
            <br></br>
            <button
              style={{ marginLeft: "70%", width: "150px", color: "white", borderRadius: "43%" }}
              className="crime-button"
              key={item.id}
              onClick={() => {
                setActiveObject(item);
                setShowModal(true);
                { item.hasFotos ? setContainer("modal-container") : setContainer("modal-container-withoutphotos") }

              }}
              className={getClass(item)}>ver más</button>
          </div>
        ))}
        {showModal ? <Modal object={activeObject} container={container} /> : null}
      </ul>


    </>

  );
};



export default CrimeList;