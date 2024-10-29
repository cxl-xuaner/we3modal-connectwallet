"use client"; // 使用客户端组件

import React, { useEffect, useState } from 'react';
import { createPublicClient, http, parseAbiItem, formatUnits } from "viem";
import { mainnet } from 'viem/chains';
import Head from 'next/head';

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http("https://eth.llamarpc.com")
});

const BlockWatcher = () => {
  const [newData, setNewData] = useState({ newBlockNumber: "updating", newBlockHash: "updating" });
  const [logs, setLogs] = useState([]); // 新增状态以存储事件日志

  useEffect(() => {
    const unwatchBlock = publicClient.watchBlocks({
      onBlock: (block) => {
        const newBlockNumber = block['number'].toString();
        const newBlockHash = block['hash'];

        // 更新状态
        setNewData({ newBlockNumber, newBlockHash });
      }
    });

    // 监听 Transfer 事件
    const unwatchLog = publicClient.watchEvent({
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'), 
      onLogs: (logs) => {
        const newLogs = logs.map(log => {
          const newBlockNumber = log['blockNumber'].toString();
          const newTransactionHash = log['transactionHash'];
          const from = log['args']['from'];
          const to = log['args']['to'];
          const value = parseFloat(formatUnits(log['args']['value'], 6)).toFixed(3); // 格式化 value

          // 打印日志到控制台
          console.log(`在区块: ${newBlockNumber}, 交易中从: ${from} 转账: ${value} USDT 到 ${to}, transactionHash: ${newTransactionHash}`);

          // 返回新的日志格式
          return { newBlockNumber, newTransactionHash, from, to, value };
        });

        // 更新日志状态
        setLogs(prevLogs => [...newLogs]);
      }
    });

    // 清理函数：组件卸载时取消监听
    return () => {
      unwatchBlock();
      unwatchLog();
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>以太坊最新区块数据</h1>
      <h2 style={styles.blockInfo}>
        当前区块高度: <span style={styles.highlight}>{newData.newBlockNumber}</span>
      </h2>
      <h2 style={styles.blockInfo}>
        blockHash: <span style={styles.highlight}>{newData.newBlockHash}</span>
      </h2>
      
      {/* 显示事件日志 */}
      <h3 style={styles.subtitle}>USDT交易记录:{logs.length} 笔</h3>
      <div style={styles.logContainer}>
        <ul style={styles.list}>
          {logs.length === 0 ? (
            <li style={styles.listItem}>没有USDT交易记录</li>
          ) : (
            logs.map((log, index) => (
              <li key={index} style={styles.listItem}>
                序号: <span style={styles.highlight}>{index}</span><br />
                在区块: <span style={styles.highlight}>{log.newBlockNumber}</span><br />
                交易中从: <span style={styles.highlight}>{log.from}</span><br />
                转账: <span style={styles.highlight}>{log.value} USDT</span><br />
                到: <span style={styles.highlight}>{log.to}</span><br />
                交易哈希: <span style={styles.highlight}>{log.newTransactionHash}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  blockInfo: {
    color: '#555',
    marginBottom: '20px',
  },
  subtitle: {
    color: '#666',
    marginTop: '30px',
  },
  logContainer: {
    maxHeight: '500px', // 设置最大高度
    overflowY: 'auto', // 允许垂直滚动
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '10px',
    backgroundColor: '#fff',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    marginBottom: '10px', // 每个日志项的底部边距
  },
  highlight: {
    fontWeight: 'bold',
    color: '#0070f3',
  },
};


export default function Page() {
  return (
    <main>
      <BlockWatcher />
    </main>
  );
}
