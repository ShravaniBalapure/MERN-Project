import { useEffect, useState } from 'react';
import axios from 'axios';

const DataComponent = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/data');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>Fetched Data</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};

export default DataComponent;
