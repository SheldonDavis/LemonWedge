//import hooks
import useLocalStorage from '../hooks/useLocalStorage'

const useArrayList = (key, initValue) => {
    const [value, setValue] = useLocalStorage(key, initValue)

    const addOrRemove=(value)=>{
        setValue(prev => {
            if (!prev) return [value]
            if(prev.includes(value)){
                //doNothing
                let index = prev.indexOf(value);
                prev.splice(index, 1);

                //maybe a remove option later?
                return [...prev]
            }else{
                //add item
                return [...prev, value]
            }
            // return typeof value ==='boolean' ? value : !prev
        })
    }
    const reset = () => setValue(initValue)
    
return {value,reset,addOrRemove}
}
export default useArrayList