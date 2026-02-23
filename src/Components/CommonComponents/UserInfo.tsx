import { useUser } from '@/context/AuthContext';


const UserInfo = () => {
const { user } = useUser()
    return (
        <div className=' flex  border-t-2 w-full justify-center items-center p-2 gap-2'>
            <p className='bg-gray-200 rounded-full h-6 w-6 border border-black'></p>
               <p>{user?.fullName}</p>
            
        </div>
    );
};

export default UserInfo;