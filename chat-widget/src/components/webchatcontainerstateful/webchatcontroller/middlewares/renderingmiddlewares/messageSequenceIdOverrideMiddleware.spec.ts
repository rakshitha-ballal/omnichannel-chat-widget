import { Constants } from "../../../../../common/Constants";
import { IWebChatAction } from "../../../interfaces/IWebChatAction";
import { WebChatActionType } from "../../enums/WebChatActionType";
import createMessageSequenceIdOverrideMiddleware from "./messageSequenceIdOverrideMiddleware";

describe("messageSequenceIdOverrideMiddleware", () => {

    it("sequenceId is overrided", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const next = (args: any) => args;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dispatch: any = () => { return 1; };
        const action: IWebChatAction = {
            type: WebChatActionType.DIRECT_LINE_INCOMING_ACTIVITY,
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                            "OriginalMessageId": "1683742135918"
                        },
                        "webchat:sequence-id": 12345
                    }
                },
            },
        };

        const middleware = createMessageSequenceIdOverrideMiddleware(dispatch)(next)(action);
        let resultValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const channelData = (middleware.payload as any).activity.channelData;

        Object.keys(channelData).forEach(function (key) {
            if (key === Constants.WebchatSequenceIdAttribute) {
                resultValue = channelData[key];
            }
        });

        expect(resultValue).toEqual(1683742135918);
    },
    );

    it("sequenceId is not overrided due to empty string for originalID", () => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const next = (args: any) => args;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dispatch: any = () => { return 1; };
        const action: IWebChatAction = {
            type: WebChatActionType.DIRECT_LINE_INCOMING_ACTIVITY,
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                            "OriginalMessageId": ""
                        },
                        "webchat:sequence-id": 12345
                    }
                },
            },
        };

        const middleware = createMessageSequenceIdOverrideMiddleware(dispatch)(next)(action);
        let resultValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const channelData = (middleware.payload as any).activity.channelData;

        Object.keys(channelData).forEach(function (key) {
            if (key === Constants.WebchatSequenceIdAttribute) {
                resultValue = channelData[key];
            }
        });

        expect(resultValue).toEqual(12345);
    });

    it("sequenceId is not overrided, due to OriginalMessageId being not a string of numbers ", () => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const next = (args: any) => args;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dispatch: any = () => { return 1; };
        const action: IWebChatAction = {
            type: WebChatActionType.DIRECT_LINE_INCOMING_ACTIVITY,
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                            "OriginalMessageId": "abcdf"
                        },
                        "webchat:sequence-id": 12345
                    }
                },
            },
        };

        const middleware = createMessageSequenceIdOverrideMiddleware(dispatch)(next)(action);
        let resultValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const channelData = (middleware.payload as any).activity.channelData;

        Object.keys(channelData).forEach(function (key) {
            if (key === Constants.WebchatSequenceIdAttribute) {
                resultValue = channelData[key];
            }
        });

        expect(resultValue).toEqual(12345);
    });

    it("no changes since webchat id is not present", () => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const next = (args: any) => args;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dispatch: any = () => { return 1; };
        const payloadExpected = {
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                            "OriginalMessageId": "123456789"
                        }
                    }
                }
            }
        };
        const action: IWebChatAction = {
            type: WebChatActionType.DIRECT_LINE_INCOMING_ACTIVITY,
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                            "OriginalMessageId": "123456789"
                        }
                    }
                }
            }
        };

        const middleware = createMessageSequenceIdOverrideMiddleware(dispatch)(next)(action);
        expect((middleware.payload as any)).toEqual(payloadExpected.payload);
    });

    it("no changes since OriginalMessageId is not present", () => {

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const next = (args: any) => args;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dispatch: any = () => { return 1; };
        const payloadExpected = {
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                        },
                        "webchat:sequence-id": 12345
                    }
                }
            }
        };
        const action: IWebChatAction = {
            type: WebChatActionType.DIRECT_LINE_INCOMING_ACTIVITY,
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                        },
                        "webchat:sequence-id": 12345
                    }
                }
            }
        };

        const middleware = createMessageSequenceIdOverrideMiddleware(dispatch)(next)(action);
        expect((middleware.payload as any)).toEqual(payloadExpected.payload);
    });


    it("no override, since the type of message is not incoming activity", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const next = (args: any) => args;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dispatch: any = () => { return 1; };
        const action: IWebChatAction = {
            type: "something else",
            payload: {
                text: "test-text",
                activity: {
                    channelId: "ACS_CHANNEL",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                            "OriginalMessageId": "1683742135918"
                        },
                        "webchat:sequence-id": 12345
                    }
                },
            },
        };

        const middleware = createMessageSequenceIdOverrideMiddleware(dispatch)(next)(action);
        let resultValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const channelData = (middleware.payload as any).activity.channelData;

        Object.keys(channelData).forEach(function (key) {
            if (key === Constants.WebchatSequenceIdAttribute) {
                resultValue = channelData[key];
            }
        });

        expect(resultValue).toEqual(12345);
    },
    );

    it("no override, since the channel is not ACS", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const next = (args: any) => args;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dispatch: any = () => { return 1; };
        const action: IWebChatAction = {
            type: "something else",
            payload: {
                text: "test-text",
                activity: {
                    channelId: "OtherChannel",
                    from: {
                        role: "user"
                    },
                    channelData: {
                        metadata: {
                            "OriginalMessageId": "1683742135918"
                        },
                        "webchat:sequence-id": 12345
                    }
                },
            },
        };

        const middleware = createMessageSequenceIdOverrideMiddleware(dispatch)(next)(action);
        let resultValue;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        const channelData = (middleware.payload as any).activity.channelData;

        Object.keys(channelData).forEach(function (key) {
            if (key === Constants.WebchatSequenceIdAttribute) {
                resultValue = channelData[key];
            }
        });

        expect(resultValue).toEqual(12345);
    },
    );

});