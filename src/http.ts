/*
 * Copyright (c) 2022 Brandon Jordan
 * Last Modified: 8/5/2022 16:42
 */

type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface HttpRequest {
    request: XMLHttpRequest,
    method: HTTPMethod,
}

interface Options {
    responseType: XMLHttpRequestResponseType,
    data: Record<string, string>,
    headers: Object
}

let HTTP = {
    request: (method: HTTPMethod, url: string, options?: Options | undefined): HttpRequest => {
        return new HttpRequest(method, url, options);
    },
    get: (url: string, options?: Options | undefined): Promise<Object> => {
        return new HttpRequest("GET", url, options).send();
    },
    post: (url: string, options?: Options | undefined): Promise<Object> => {
        return new HttpRequest("POST", url, options).send();
    },
    put: (url: string, options?: Options | undefined): Promise<Object> => {
        return new HttpRequest("PUT", url, options).send();
    },
    patch: (url: string, options?: Options | undefined): Promise<Object> => {
        return new HttpRequest("PATCH", url, options).send();
    },
    delete: (url: string, options?: Options | undefined): Promise<Object> => {
        return new HttpRequest("DELETE", url, options).send();
    },
};

class HttpRequest {
    constructor(method: HTTPMethod, url: string, options?: Options | undefined) {
        this.request = new XMLHttpRequest();
        let body: XMLHttpRequestBodyInit = '';
        this.method = method;
        if (typeof options !== 'undefined') {
            if (options.responseType) {
                this.request.responseType = options.responseType;
            }
            if (options.data) {
                if (this.method === "GET") {
                    url += '?' + new URLSearchParams(options.data).toString();
                } else {
                    let formData = new FormData();
                    for (let key in options.data) {
                        // @ts-ignore
                        formData.append(key, options.data[key]);
                    }
                    body = formData;
                }
            }
            if (options.headers) {
                for (let header in options.headers) {
                    // @ts-ignore
                    this.request.setRequestHeader(header, options.headers[header]);
                }
            }
        }
        this.request.open(method, url, true);
        this.request.send(body);
    }

    send(): Promise<Object> {
        return new Promise((resolve: (request: Object) => void) => {
            this.request.onload = () => {
                if (this.request.status >= 200 && this.request.status < 400) {
                    let response = {
                        data: this.request.response,
                        type: this.request.responseType,
                        status: this.request.status,
                        statusText: this.request.statusText
                    };
                    resolve(response);
                } else {
                    this.error();
                    throw new Error(this.request.response);
                }
            }
            this.request.onerror = () => {
                this.error();
                throw new Error(this.request.response);
            }
            this.request.ontimeout = () => {
                this.error();
                throw new Error('timeout');
            }
            this.request.onabort = () => {
                this.error();
                throw new Error('aborted')
            };
        });
    }

    error() {
        console.error(`HTTP.${this.method}(): ${this.request.status} `+(this.request.response ? this.request.response : ''));
    }

    progress(callback: (percent: number) => void) {
        this.request.onprogress = (oEvent) => {
            if (oEvent.lengthComputable) {
                callback(oEvent.loaded / oEvent.total * 100);
            } else {
                // Unable to compute progress information since the total size is unknown
                callback(0);
            }
        };
        return this;
    }
}

function get(url: string): Promise<Object> {
    return new HttpRequest("GET", url).send();
}