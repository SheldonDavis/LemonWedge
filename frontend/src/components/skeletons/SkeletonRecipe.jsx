import Skeleton from './Skeleton.jsx'

const SkeletonRecipe = () => {
    return(
        <div className='singleRecipe'>
            <Skeleton classes={'title width-50'}/>
            <Skeleton classes={'title width-100'}/>
            <Skeleton classes={'title width-100'}/>
            <Skeleton classes={'title width-100'}/>
        </div>
    )
}
export default SkeletonRecipe