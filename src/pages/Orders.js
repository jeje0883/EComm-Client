import OrdersCard from '../components/OrdersCard';
import OrdersTable from '../components/OrdersTable';
import { useContext } from 'react';
import { UserContext} from '../context/UserContext';


export default function Orders() {
    
    const { user } = useContext(UserContext);
    
    return (
        <div className="d-flex justify-content-center">
            <div>
                {user.isAdmin?  <OrdersTable/> : <OrdersCard/>}
            </div>
        </div>
    );
};