import classes from './LoadingPage.module.css'
import logo from './assets/img/pill.png'
const LoadingPage = () => {
	return (
		<div className={classes.loading}>
			<img className={classes.loadingImg} src={logo}></img>
		</div>
	)
}

export default LoadingPage
