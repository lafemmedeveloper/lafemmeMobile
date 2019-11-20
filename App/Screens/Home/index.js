import {connect} from 'react-redux';
import Content from './Content';

import {setLoading, getDeviceInfo} from '../../Core/UI/Actions';
import {getServices, getOrders} from '../../Core/Services/Actions';
import {setAuth, setAccount, logOut} from '../../Core/User/Actions';

const mapStateToProps = ({ui, currentUser, services}) => {
  const {loading, deviceInfo} = ui;
  const {auth, user} = currentUser;

  return {
    loading,
    user,
    auth,
    services: services.services,
    orders: services.orders,
    deviceInfo,
    imgs: [
      {
        src: 'https://c1.staticflickr.com/9/8387/8638813125_3cac0dc01c_n.jpg',
        width: 274,
        height: 182,
        rating: 4.2,
        date: '09-10-2019',
        expertName: 'Sofia Botero',
        expertImage:
          'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
      },
      {
        src: 'https://c1.staticflickr.com/9/8388/8647725119_458d0c92a2_n.jpg',
        width: 243,
        height: 182,
        rating: 4.8,
        date: '09-10-2019',
        expertName: 'Sofia Botero',
        expertImage:
          'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
      },
      {
        src: 'https://c1.staticflickr.com/6/5162/5230435699_f1eec256fe_n.jpg',
        width: 272,
        height: 182,
        rating: 4.0,
        date: '09-10-2019',
        expertName: 'Sofia Botero',
        expertImage:
          'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
      },
      {
        src: 'https://c1.staticflickr.com/4/3644/3396273424_47b22fd76f_m.jpg',
        width: 199,
        height: 182,
        rating: 3.5,
        date: '09-10-2019',
        expertName: 'Sofia Botero',
        expertImage:
          'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
      },
      {
        src: 'https://c1.staticflickr.com/7/6007/5987700999_7dbff6cb6c_n.jpg',
        width: 259,
        height: 172,
        rating: 5.0,
        date: '09-10-2019',
        expertName: 'Sofia Botero',
        expertImage:
          'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
      },
      {
        src: 'https://c1.staticflickr.com/1/183/363751844_4fe568940a_m.jpg',
        width: 240,
        height: 172,
        rating: 4.1,
        date: '09-10-2019',
        expertName: 'Sofia Botero',
        expertImage:
          'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
      },
      {
        src: 'https://c1.staticflickr.com/4/3457/3945833048_49caa3fc57_n.jpg',
        width: 260,
        height: 172,
        rating: 5.0,
        date: '09-10-2019',
        expertName: 'Sofia Botero',
        expertImage:
          'https://firebasestorage.googleapis.com/v0/b/lafemme-5017a.appspot.com/o/experts%2F2345676543234576543.jpg?alt=media&token=a4152781-ac35-48d6-9698-63d745fa2d82',
      },
    ],
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLoading: state => dispatch(setLoading(state)),
    getServices: () => dispatch(getServices()),
    getOrders: () => dispatch(getOrders()),

    getDeviceInfo: () => dispatch(getDeviceInfo()),
    setAuth: user => dispatch(setAuth(user)),
    setAccount: () => dispatch(setAccount()),
    logOut: uid => dispatch(logOut()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Content);
