package auth_test

import (
	"context"
	"testing"
	"time"

	"automation/app/auth"
	"automation/app/auth/mock"
	"automation/config"

	"github.com/stretchr/testify/suite"
	"go.uber.org/mock/gomock"
)

type AuthServiceTestSuite struct {
	suite.Suite

	controller *gomock.Controller
	ctx        context.Context
	now        time.Time

	mUserRepo *mock.MockUserRepository

	mSessionRepo *mock.MockSessionRepository
	mGoogle      *mock.MockGoogleOAuth2
	mDiscord     *mock.MockDiscordOAuth2
	mGithib      *mock.MockGithubOAuth2
	mTiktok      *mock.MockTiktokOAuth2
	mTimer       *mock.MockTimer
	mX           *mock.MockXOAuth2
	mEncryptor   *mock.MockEncryptor

	service auth.Service
}

func (s *AuthServiceTestSuite) SetupTest() {
	s.controller = gomock.NewController(s.T())
	s.ctx = context.Background()
	s.now = time.Now().UTC()
	s.mUserRepo = mock.NewMockUserRepository(s.controller)
	s.mSessionRepo = mock.NewMockSessionRepository(s.controller)
	s.mGoogle = mock.NewMockGoogleOAuth2(s.controller)
	s.mDiscord = mock.NewMockDiscordOAuth2(s.controller)
	s.mGithib = mock.NewMockGithubOAuth2(s.controller)
	s.mX = mock.NewMockXOAuth2(s.controller)
	s.mTimer = mock.NewMockTimer(s.controller)
	s.mEncryptor = mock.NewMockEncryptor(s.controller)

	s.service = auth.NewService(
		&config.Config{},
		s.mUserRepo,
		s.mSessionRepo,
		s.mGoogle,
		s.mGithib,
		s.mDiscord,
		s.mTiktok,
		s.mX,
		s.mEncryptor,
		func() time.Time { return time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC) },
		func() string { return "UUID" },
	)
}

func (s *AuthServiceTestSuite) TearDownTest() {
	s.controller.Finish()
}

func TestGeneratorTestSuite(t *testing.T) {
	suite.Run(t, new(AuthServiceTestSuite))
}
