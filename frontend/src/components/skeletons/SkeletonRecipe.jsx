import Skeleton from './Skeleton.jsx'

const SkeletonRecipe = () => {
    return(
        <div className='singleRecipe pad1_2rem'>
            <Skeleton classes={'title width-50'}/>
            <Skeleton classes={'title width-100'}/>
            <Skeleton classes={'title width-100'}/>
            <Skeleton classes={'title width-100'}/>
        </div>
    )
}
export default SkeletonRecipe