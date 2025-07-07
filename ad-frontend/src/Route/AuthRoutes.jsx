import ForgetPwd from '../Components/Pages/Auth/ForgetPwd';
import ErrorPage1 from '../Components/Pages/ErrorPages/ErrorPage400';
import ErrorPage2 from '../Components/Pages/ErrorPages/ErrorPage401';
import ErrorPage3 from '../Components/Pages/ErrorPages/ErrorPage403';
import ErrorPage4 from '../Components/Pages/ErrorPages/ErrorPage404';
import Logins from '../Auth/Signin';
import Error500 from '../Components/Pages/ErrorPages/ErrorPage500';
import Error503 from '../Components/Pages/ErrorPages/ErrorPage503';

export const authRoutes = [
  { path: `/login`, Component: <Logins /> },
  { path: `/forgot-password`, Component: <ForgetPwd /> },



  //Error
  { path: `/pages/errors/error400/:layout`, Component: <ErrorPage1 /> },
  { path: `/pages/errors/error401/:layout`, Component: <ErrorPage2 /> },
  { path: `/pages/errors/error403/:layout`, Component: <ErrorPage3 /> },
  { path: `/pages/errors/error404/:layout`, Component: <ErrorPage4 /> },
  { path: `/pages/errors/error500/:layout`, Component: <Error500 /> },
  { path: `/pages/errors/error503/:layout`, Component: <Error503 /> },
];
