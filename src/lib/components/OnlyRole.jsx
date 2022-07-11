import { Component } from 'react';

class OnlyRole extends Component {

    render() {
        const user = this.props.user;
        const role = this.props.role;
        if (user.roles.some(r => r.value === role)) {
            return this.props.children;
        } else {
            return null;
        }
    }
}

export default OnlyRole;