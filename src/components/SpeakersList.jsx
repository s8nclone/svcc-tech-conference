import Speaker from './Speaker'
import useRequestRest, { REQUEST_STATUS } from '../hooks/useRequestRest'
import { data } from "../../SpeakerData"
import { SpeakerFilterContext } from '../contexts/SpeakerFilterContext'
import { useContext } from 'react'
import SpeakerAdd from './SpeakerAdd'
import LoadingPlaceholder from './LoadingPlaceholder'


function SpeakersList() {

    const {
        data: speakersData,
        requestStatus,
        error,
        updateRecord,
        insertRecord,
        deleteRecord
    } = useRequestRest();

    const { searchQuery, eventYear } = useContext(SpeakerFilterContext);

    if (requestStatus === REQUEST_STATUS.FAILURE) {
        return (
            <div className="text-danger">
                ERROR: <b>loading speaker data failed {error}</b>
            </div>
        )
    }

    // if (isLoading === true) return <div>Loading...</div>
    if (requestStatus === REQUEST_STATUS.LOADING) {
        return <LoadingPlaceholder />;
    }

    return (
        <div className="container speakers-list">
            <SpeakerAdd eventYear={eventYear} insertRecord={insertRecord} />
            <div className="row">
                {speakersData.filter((speaker)=> {
                    return (
                        speaker.first.toLowerCase().includes(searchQuery) ||
                        speaker.last.toLowerCase().includes(searchQuery)
                    )
                })
                .filter((speaker)=> {
                    return speaker.sessions.find((sessions)=>{
                        return sessions.eventYear === eventYear;
                    });
                })
                .map((speaker)=> {

                    return (
                        <Speaker key={speaker.id} 
                            speaker={speaker}
                            updateRecord={updateRecord}
                            insertRecord={insertRecord}
                            deleteRecord={deleteRecord}
                        />
                    )
                })}
                
            </div>
        </div>
    )
}

export default SpeakersList
