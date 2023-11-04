
import styles from './miniCardPopUp.module.css'

import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { ref , deleteObject } from 'firebase/storage';
import { storage } from '../../firebase/firebase';


import editIcon from '/src/assets/icons/editIcon.png'
import viewIcon from '/src/assets/icons/viewIcon.png'
import shareIcon from '/src/assets/icons/shareIcon.png'
import qrIcon from '/src/assets/icons/qrIcon.png'
import deleteIcon from '/src/assets/icons/deleteIcon.png'

import QRCode from 'qrcodejs';

function MiniCardPopUp(props) {

    const navigateTo = useNavigate()
    if(props.data.data){
        console.log(props.data)
    const selectedCardData = props.data.data.cardData
    const isActive = props.data.active === true
    const setSelectedCard = props.setSelectedCard

    console.log(isActive , selectedCardData) 

    const data = props.data
    const cardData = data.data
    const generalData = cardData.generalData
    const displayData = cardData.displayData
    const cardID = props.data.id
    const pictureRef = ref(storage, `cardImages/${displayData?.imageUUID}`);
    

    const deleteCard = ()=>{


        async function deleteDocFromDb (){
            await deleteDoc(doc(db, "cards", cardID));
        }
        deleteDocFromDb()

        if(displayData?.imageUUID){
            deleteObject(pictureRef).then(() => {
            console.log('file deleted succesfuly')
            }).catch((error) => {
            console.log(error)
            });
        }   

        props.setCardDocs(
           current =>
                current.filter(doc => {
                 
                  return doc.id !== cardID;
                }),
             
        )
        setSelectedCard({active:false})
    }


  
    return ( 
        <div className={`${styles.miniCardPopUp} ${isActive === true && styles.active}`}>
            <div className={styles.miniCardPopUpShadow}
            onClick={(e)=>{setSelectedCard({active:false})}}
            ></div>
            <section className={styles.miniCardPopUpSection}>

                <header>
                    <h1>{selectedCardData?.generalData?.cardname}</h1>
                    <button   onClick={(e)=>{setSelectedCard({active:false})}}>X</button>
                </header>


            <section className={styles.bigBtnSection}>
                <button onClick={()=>{navigateTo(`/editcard/${props.data.id}`)}}>
                    <img src={editIcon}/>
                    <h1>Edit Card</h1> 
                    <p>Customize your card</p>

                </button>
                <button onClick={()=>{navigateTo(`/viewcard/${props.data.id}`)}}>
                    <img src={viewIcon}/>
                    <h1>View Card</h1> 
                    <p>View your card</p>
                    
                    </button>
                <button onClick={()=>{navigator.clipboard.writeText(`https://share-card.netlify.app/viewcard/${props.data.id}`)}}>
                    <img src={shareIcon}/>
                    <h1>Share Card</h1> 
                    <p>Share your card</p>
                </button>
                <button onClick={deleteCard}>
                    
                    <img src={deleteIcon}/>
                    <h1>Delete Card</h1> 
                    <p>Delete your card premanently</p>

                </button>
            </section>


                {/* <button onClick={deleteCard} className={styles.deleteCardBtn}><img src={deleteIcon}/>Delete Card</button> */}




            </section>
        </div>
    );
}
}

export default MiniCardPopUp;