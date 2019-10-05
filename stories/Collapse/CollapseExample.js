import React from 'react'
import { Button, Collapse, Card, CardBody } from '../../src'

class CollapseExample extends React.Component {
  state = { collapse: false }

  toggle = () => {
    this.setState({ collapse: !this.state.collapse })
  }

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          Link with href
        </Button>{' '}
        <Button color="primary" onClick={this.toggle}>
          Button with data-target
        </Button>
        <Collapse isOpen={this.state.collapse}>
          <Card>
            <CardBody>
              Anim pariatur cliche reprehenderit, enim eiusmod high life
              accusamus terry richardson ad squid. Nihil anim keffiyeh
              helvetica, craft beer labore wes anderson cred nesciunt sapiente
              ea proident.
            </CardBody>
          </Card>
        </Collapse>
      </div>
    )
  }
}

export default CollapseExample
