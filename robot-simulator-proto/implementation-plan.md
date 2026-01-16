# ロボットシミュレーター実装プラン

## 概要
ロボットから分析サービス、農業情報基盤へのデータフローをWebシミュレーションするシステムの実装計画

## システム構成

```
[ロボット] → [分析サービス] → [農業情報基盤]
```

## 画面レイアウト

```
+------------------+------------------+
|                  |                  |
|  ロボット制御    |  分析サービス    |
|  (左側フレーム)  |  (右側フレーム)  |
|                  |                  |
|  - 入力フォーム  |  - 解析結果表示  |
|  - ログ送信      |  - 送信ボタン    |
|                  |                  |
+------------------+------------------+
```

## データモデル

### ロボット稼働ログ
```typescript
{
  speed: number,              // 走行速度 (km/h)
  tilt: {                     // 傾き状態
    pitch: number,            // 前後傾き (度)
    roll: number              // 左右傾き (度)
  },
  startTime: string,          // 走行開始時刻 (ISO 8601)
  stopTime: string,           // 走行停止時刻 (ISO 8601)
  route: Array<{              // 走行経路
    latitude: number,
    longitude: number,
    timestamp: string
  }>,
  anomalyCode?: string,       // 異常検知コード (オプション)
  anomalyDetails?: {          // 異常詳細情報 (オプション)
    type: string,             // 異常タイプ (obstacle/hardware/deviation)
    description: string,
    relatedData: object
  }
}
```

### 分析サービス出力
```typescript
{
  robotLogId: string,
  analysisTimestamp: string,
  status: string,             // normal/warning/error
  insights: Array<string>,    // 分析結果のインサイト
  recommendations: Array<string>
}
```

## 実装ステップ

### Phase 1: 基本UI構築
1. **index.html** - メインHTML構造
   - 左右2カラムレイアウト
   - レスポンシブデザイン（Bootstrap使用）

2. **styles.css** - スタイリング
   - フレーム区切り
   - フォームデザイン
   - ボタンスタイル

3. **app.js** - 基本JavaScript
   - DOM操作
   - イベントハンドラー

### Phase 2: ロボット制御パネル実装
1. **入力フォーム作成**
   - 走行速度入力
   - 傾き状態入力（pitch/roll）
   - 時刻入力（開始/停止）
   - 位置情報入力（緯度/経度の配列）
   - 異常検知コード入力
   - 異常詳細情報入力

2. **データ送信機能**
   - フォームバリデーション
   - JSON形式でのデータ構築
   - 分析サービスへの送信（シミュレーション）

### Phase 3: 分析サービスパネル実装
1. **受信データ表示**
   - ロボットログの整形表示
   - JSONビューアー

2. **分析処理シミュレーション**
   - 受信データの自動解析
   - ステータス判定ロジック
   - インサイト生成

3. **農業情報基盤への送信**
   - 送信ボタン実装
   - 送信履歴表示
   - 送信確認ダイアログ

### Phase 4: データフロー可視化
1. **ステータス表示**
   - データ送信状態の可視化
   - 処理フロー表示

2. **ログ履歴**
   - 送信履歴一覧
   - LocalStorageでの永続化

### Phase 5: 拡張機能
1. **位置情報マップ表示**
   - 走行経路の地図表示（Leaflet.js使用）

2. **異常検知パターン**
   - 障害物検知シミュレーション
   - ハードウェア異常シミュレーション
   - 経路逸脱シミュレーション

3. **データエクスポート**
   - JSON/CSVダウンロード機能

## 技術スタック

- **HTML5** - 構造
- **CSS3 / Bootstrap 5** - スタイリング
- **Vanilla JavaScript** - ロジック
- **LocalStorage** - データ永続化
- **Leaflet.js** (オプション) - 地図表示

## ファイル構成

```
/c:/Project/NS-APU/robot-simulator-proto/
├── index.html              # メインHTML
├── css/
│   └── styles.css         # カスタムスタイル
├── js/
│   ├── app.js            # メインアプリケーションロジック
│   ├── robot-control.js  # ロボット制御ロジック
│   ├── analysis-service.js # 分析サービスロジック
│   └── data-store.js     # データ管理
└── implementation-plan.md # このファイル
```

## 開発スケジュール

| Phase | 作業内容 | 所要時間（目安） |
|-------|---------|----------------|
| Phase 1 | 基本UI構築 | 2-3時間 |
| Phase 2 | ロボット制御パネル | 3-4時間 |
| Phase 3 | 分析サービスパネル | 3-4時間 |
| Phase 4 | データフロー可視化 | 2-3時間 |
| Phase 5 | 拡張機能 | 4-6時間 |

## テストシナリオ

1. **正常系**
   - ロボットログ入力 → 分析 → 農業情報基盤送信

2. **異常系**
   - 障害物検知時のフロー
   - ハードウェア異常時のフロー
   - 経路逸脱時のフロー

3. **バリデーション**
   - 必須項目チェック
   - データ形式チェック

## 次のステップ

1. Phase 1の実装開始
2. 各Phaseごとに動作確認
3. フィードバックに基づく改善