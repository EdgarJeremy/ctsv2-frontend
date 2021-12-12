import React from "react";
import { InputGroup, InputGroupAddon, Button } from "reactstrap";
import helper from "../services/helper";
import swal from "sweetalert";
import sfx from "./Sfx";

export default class Chat extends React.Component {

    state = {
        limit: 200,
        offset: 0,
        msgs: []
    }

    componentWillMount() {
        this.props.socket.off("incoming_chat");
        this.props.socket.on("incoming_chat", this._onIncomingChat.bind(this));
        this._fetchMsgs();
    }


    _onIncomingChat(data) {
        sfx.play();
        if (!this.props.open) {
            this.props.toggle();
        }
        this._fetchMsgs();
    }

    _fetchMsgs(p = this.props, scroll = true) {
        this.props.models.authenticated.chat_index(this.state.limit, this.state.offset, p.to.id_pengguna).then((msgs) => {
            this.setState({ msgs: msgs.data.data });
            if(scroll)
                this._toBottom();
        }).catch((e) => swal("Error", e.toString(), "error"));
    }

    componentDidMount() {
        this._toBottom();
        this._inputMsg.focus();
    }

    _toBottom() {
        this.chat_box_body.scrollTop = this.chat_box_body.scrollHeight;
    }

    componentWillReceiveProps(p) {
        this._toBottom();
        if (p.open) {
            this._fetchMsgs(p);
            this._inputMsg.focus();
        }
    }

    _onSubmit(e) {
        e.preventDefault();
        let data = helper.inspect(new FormData(e.target));
        if(data.message) {
            this._send(data).then((data) => {
                this._fetchMsgs();
                this._form.reset();
            }).catch((e) => swal("Error", e.toString(), "error"));
        }
    }

    _send(data) {
        return this.props.models.authenticated.chat_create(data);
    }

    _onScroll(e) {
        // let $first = Object.assign({}, $(".chat-box-body .chat-msg-container:first"));
        // console.log($first);
        // if(e.target.scrollTop === 0) {
        //     console.log($first);
        //     // console.log(last);
        //     this.setState({limit: this.state.limit + 15}, () => {
        //         this._fetchMsgs(this.props, false);
        //         // this.chat_box_body.scrollTop = ;
        //     });
        // }
    }

    render() {
        return (
            <div className="chat-item">
                <div className={"chat-box " + ((!this.props.open ? "chat-hide" : ""))}>
                    <div className="chat-box-header">
                        <img className="chat-user-photo" alt="Username Here.." src={"/favicon.png"} />
                        <h5 className="chat-user-title text-center">{this.props.to.nama_pengguna}</h5><hr />
                        <p className="chat-user-subtitle text-center"><i className={"fa fa-circle chat-user-"+((this.props.to.online ? "online" : "offline"))}></i>&nbsp;&nbsp;{this.props.to.online ? "Online" : "Offline"}</p>
                    </div>
                    <div className="chat-box-body" ref={(e) => this.chat_box_body = e} onScroll={this._onScroll.bind(this)}>
                        {this.state.msgs.map((msg, i) => (
                            <div key={i} className="chat-msg-container">
                                <div className={"chat-msg-item " + ((msg.id_pengguna === this.props.me ? "chat-msg-me" : ""))}>
                                    <p>{msg.message} {
                                        (msg.id_pengguna === this.props.me) ?
                                            ((!msg.dibaca) ? <i className="fa fa-check"></i> : <i className="fa fa-check-circle"></i>)
                                            : ""
                                    }</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-box-footer">
                        <form ref={(e) => this._form = e} onSubmit={this._onSubmit.bind(this)}>
                            <InputGroup>
                                <input name="to" type="hidden" value={this.props.to.id_pengguna} />
                                <input className="form-control" ref={(e) => this._inputMsg = e} name="message" type="text" placeholder="Ketik pesan.." />
                                <InputGroupAddon addonType="prepend">
                                    <Button type="submit" color="primary"><i className="fa fa-send"></i></Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </form>
                    </div>
                </div>
                <div className="chat-control">
                    <button onClick={this.props.toggle} className="chat-control-button">
                        <i className="icon icon-speech"></i>
                    </button>
                    <div className="chat-control-info">
                        <span onClick={this.props.toggle} className="name">
                            <span className={"chat-control-status " + ((this.props.to.online ? "badge-success" : "badge-default"))}><i className="fa fa-circle"></i></span>
                            &nbsp;&nbsp;{this.props.to.nama_pengguna}
                        </span>
                        <span onClick={this.props.remove} className="close-btn"><i className="fa fa-close"></i> </span>
                    </div>
                </div>
            </div>
        );
    }

}