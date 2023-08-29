import Image from "next/image"
import { useContext, useState, memo } from "react"
import { SpeakerFilterContext } from "../contexts/SpeakerFilterContext"
import { SpeakerContext, SpeakerProvider } from "../contexts/SpeakerContext"
import SpeakerDelete from "./SpeakerDelete"
import ErrorBoundary from "./ErrorBoundary"

function Session({ title, room }) {
    return (
        <span className="session w-100">
            {title}
            <strong>Room: {room.name}</strong>
        </span>
    )
}

function Sessions() {

    const { eventYear } = useContext(SpeakerFilterContext);
    const { speaker } = useContext(SpeakerContext);
    const sessions = speaker.sessions;

    return (
        <div className="sessionBox card h-250">
            {sessions.filter((session)=> {
                return session.eventYear === eventYear;
            })
            .map((session)=> {
                return (
                    <div className="session w-100" key={session.id}>
                        <Session {...session} />
                    </div>
                )
            })}
        </div>
    )
}

function FallbackSpeakerImage({ src, ...props }) {

    const [error, setError] = useState(false); //checks if component is in an error state or not
    const [imgSrc, setImgSrc] = useState(src); //display an error image if in an error state

    function onError() {
        if (!error) {
            setImgSrc("/images/speaker-99999.jpg");
            setError(true);
        }
    }

    return <Image 
                src={imgSrc}
                {...props}
                onError={onError}
            />
}

function SpeakerImage() {

    const { speaker: { id, first, last }} = useContext(SpeakerContext);

    return (
        <div className="speaker-img d-flex flex-row justify-content-center align-items-center">
            <FallbackSpeakerImage
                className="contain-fit"
                src={`/images/speaker-${id}.jpg`}
                width="300"
                height="300"
                alt={`${first} ${last}`}
            />
        </div>
    )
}

function SpeakerFavorite() {

    const { speaker, updateRecord } = useContext(SpeakerContext);

    const [inTransition, setInTransition] = useState(false);

    function doneCallback() {
        setInTransition(false);
        console.log(`In SpeakerFavorite:doneCallback  ${new Date().getMilliseconds()}`);
    }

    return (
        <div className="action padB1">
            <span
            onClick={()=> {
                setInTransition(true);
                updateRecord({
                    ...speaker,
                    favorite: !speaker.favorite
                }, doneCallback);
            }}
            > 
                <i className={
                    speaker.favorite === true ?
                    "fa-solid fa-star orange" : "fa-regular fa-star orange"
                    }
                />{" "}
                Favorite{" "}
                {inTransition ? (
                    <span className="fa-solid fa-circle-notch fa-spin"></span>
                ) : null}
            </span>
        </div>
    )
}

function SpeakerDetails() {

    const { speaker } = useContext(SpeakerContext);
    const { first, last, bio, company, twitterHandle, favorite } = speaker;

    return (
        <div className="speaker-info">
            <div className="d-flex justify-content-between mb-2">
                <h3 className="text-truncate w-200">
                    {first} {last}
                </h3>
            </div>
            <SpeakerFavorite />
            <div>
                <p className="card-description">{bio}</p>
                <div className="social d-flex flex-row mt-3">
                    <div className="company">
                        <h5>Company</h5>
                        <h6>{company}</h6>
                    </div>
                    <div className="twitter">
                        <h5>Twitter</h5>
                        <h6>{twitterHandle}</h6>
                    </div>
                </div>
            </div>
        </div>)
}


//using memo to single out the component that re-renders when it's value changes rather than the whole similar components
const SpeakerNoErrorBoundary = memo(function Speaker({ speaker, updateRecord, insertRecord, deleteRecord, showErrorCard }) {

    const { showSessions } = useContext(SpeakerFilterContext);

    if (showErrorCard) {
        return (
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-sm-12 col-xs-12">
                <div className="card card-height p-4 mt-4">
                    <img src="/images/speaker-99999.jpg" />
                    <div><b>Error Showing Speaker</b></div>
                </div>
            </div>
        );
    }

    return (
        <SpeakerProvider speaker={speaker} updateRecord={updateRecord}
            insertRecord={insertRecord} deleteRecord={deleteRecord}
        >
            <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-sm-12 col-xs-12">
                <div className="card card-height p-4 mt-4">
                    <SpeakerImage />
                    <SpeakerDetails />
                </div>
                {showSessions === true ? <Sessions /> : null}
                <SpeakerDelete />
            </div>
        </SpeakerProvider>
    )
}, favoriteSpeakerToggled);

//using react errorBoundary component to deal with errored components
function Speaker(props) {
    return (
        <ErrorBoundary
            errorUI={<SpeakerNoErrorBoundary {...props} showErrorCard={true}></SpeakerNoErrorBoundary>}
        >
            <SpeakerNoErrorBoundary {...props}></SpeakerNoErrorBoundary>
        </ErrorBoundary>
    )
}

//function that checks if the previous value to the next/current value and returns a boolean
function favoriteSpeakerToggled(prevProvs, nextProps) {
    return (prevProvs.speaker.favorite === nextProps.speaker.favorite);
}

export default Speaker