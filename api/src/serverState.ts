interface ServerState {
    currentProfile: string;
}

let _serverState: ServerState = {
    currentProfile: '',
};

const serverState: () => ServerState = () => {
    return {
        ..._serverState,
    };
};

const updateServerState = (newState: Partial<ServerState>) => {
    _serverState = {
        ..._serverState,
        ...newState,
    };
};

export { serverState, updateServerState };
