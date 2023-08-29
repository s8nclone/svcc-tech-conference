import { useState, useEffect } from 'react'

export const REQUEST_STATUS = {
    LOADING: "loading",
    SUCCESS: "success",
    FAILURE: "failed"
};

function useRequestDelay(delayTime=1000, initialData=[]) {
    const [data, setData ] = useState([initialData]);
    const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.LOADING)
    const [error, setError] = useState("");

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    useEffect(()=> {
        async function delayFunc() {
            try {
                await delay(delayTime);
                // throw "Bad Error";
                setRequestStatus(REQUEST_STATUS.SUCCESS);
                setData(data);
            } catch (e) {
                setRequestStatus(REQUEST_STATUS.FAILURE)
                setError(e);
            }
        }
        delayFunc();
    }, []);

    function updateRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = data.map((rec)=> {
            return rec.id === record.id ? record : rec;
        });

        async function delayFunction() {
            try {
                setData(newRecords);
                await delay(delayTime);
                if (doneCallback) {
                    doneCallback();
                }
            } catch (err) {
                // console.log(`useRequestDelay error ${err}`);
                console.log("error thrown from inside delayFunction", error);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        }
        delayFunction();
    }

    function insertRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = [record, ...data];

        async function delayFunction() {
            try {
                setData(newRecords);
                await delay(delayTime);
                if (doneCallback) {
                    doneCallback();
                }
            } catch (err) {
                // console.log(`useRequestDelay error ${err}`);
                console.log("error thrown from inside delayFunction", error);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        }
        delayFunction();
    }

    function deleteRecord(record, doneCallback) {
        const originalRecords = [...data];
        const newRecords = data.filter((rec)=> {
            return rec.id != record.id;
        });

        async function delayFunction() {
            try {
                setData(newRecords);
                await delay(delayTime);
                if (doneCallback) {
                    doneCallback();
                }
            } catch (err) {
                // console.log(`useRequestDelay error ${err}`);
                console.log("error thrown from inside delayFunction", error);
                if (doneCallback) {
                    doneCallback();
                }
                setData(originalRecords);
            }
        }
        delayFunction();
    }

  return {
    data, requestStatus, error, updateRecord, insertRecord, deleteRecord
  };

}

export default useRequestDelay