import React, { Component } from 'react'
import Quagga from 'quagga'

interface Props {
  onDetected: (value: any) => void
}

class Scanner extends Component<Props> {
  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: 320,
            height: 200,
            // バックカメラの利用を設定. (フロントカメラは"user")
            facingMode: 'environment',
          },
          // 検出範囲の指定: 上下30%は対象外
          area: {
            top: '30%', // top offset
            right: '0%', // right offset
            left: '0%', // left offset
            bottom: '30%', // bottom offset
          },
        },
        // 解析するワーカ数の設定
        numOfWorkers: 4,
        // バーコードの種類を設定: ISBNは"ean_reader"
        decoder: {
          readers: ['ean_reader'],
        },
        locate: true,
      },
      function (err: any) {
        if (err) {
          return console.log(err)
        }
        Quagga.start()
      }
    )
    Quagga.onDetected(this._onDetected)
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected)
  }

  _onDetected = (result: any) => {
    const code: string = result.codeResult.code
    const pattern = '978'
    if (!code.indexOf(pattern)) {
      this.props.onDetected(code)
    }
  }

  render() {
    return <div id="interactive" className="viewport" />
  }
}

export default Scanner
