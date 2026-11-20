class LoadingActions {
  static handler(store, params) {
    return new LoadingActions[params.action](store, params.params);
  }

  static setShow(store) {
    store.setState({
      loading: LoadingActions.show(store)
    });
  }

  static setHide(store) {
    store.setState({
      loading: LoadingActions.hide(store)
    });
  }

  static show(store) {
    return store.getState().loading + 1;
  }

  static hide(store) {
    return store.getState().loading - 1 <= 0 ? 0 : store.getState().loading - 1;
  }
}

export default LoadingActions;
